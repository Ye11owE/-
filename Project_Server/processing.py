from flask import Flask, request, render_template, flash, send_from_directory
from keras.models import load_model
from keras.src.preprocessing.sequence import TimeseriesGenerator
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from datetime import datetime
from torch.utils.data import DataLoader
from keras.layers import Layer
import keras.backend as K
import torch.nn as nn
import pandas as pd
import numpy as np
import torch

# 用于电价预测
from utils import make_dirs, load_data, standardization, train_validate_test_split, SequenceDataset, train_model, \
    val_model, predict, inverse_transform, calculate_metrics
import main
from models import RNN, LSTM, GRU

app = Flask(__name__, template_folder='./templates',
            static_folder='./static')


class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(name='attention_weight', shape=(input_shape[-1], 1), initializer='random_normal',
                                 trainable=True)
        self.b = self.add_weight(name='attention_bias', shape=(input_shape[1], 1), initializer='zeros', trainable=True)
        super(AttentionLayer, self).build(input_shape)

    def call(self, x):
        eij = K.tanh(K.dot(x, self.W) + self.b)
        a = K.exp(eij) / K.sum(K.exp(eij), axis=1, keepdims=True)
        weighted_input = x * a
        context_vector = K.sum(weighted_input, axis=1)
        # 确保 context_vector 是二维的
        context_vector = K.expand_dims(context_vector, -1)
        return context_vector, a

    def compute_output_shape(self, input_shape):
        return (input_shape[0], input_shape[-1])


def create_dataset(power_consumption, time_step=1):
    X, y = [], []
    for i in range(len(power_consumption) - time_step):
        X.append(power_consumption[i:(i + time_step)])
        y.append(power_consumption[i + time_step])
    return np.array(X), np.array(y)


# 给各个界面定义不同的路由
@app.route('/')
def home():
    # 这里可以传递一些变量到模板中，如果需要的话
    return render_template('main.html')


# 模块一跳转
@app.route('/WindAndSolar')
def wind_ui():
    return render_template('WindAndSolar.html')


# 模块而跳转
@app.route('/electric_ui')
def electric_ui():
    excel_file = 'data.xlsx'
    df = pd.read_excel(excel_file)
    data_time = df['date'].dt.strftime('%Y-%m-%d %H:%M:%S').tolist()
    data_price = df['electricity_price (PLN/MWh)'].tolist()
    data = {'electricity_price': data_price, 'date': data_time}
    return render_template('electricity_ui.html', data_series=data)


# 模块三跳转
@app.route('/worldInfo')
def worldInfo_ui():
    return render_template('worldInfo.html')


# 提取数据(电力和电价)并预测
@app.route('/trainElectric', methods=['POST'])
def train_model_electric():
    # 负荷预测
    # 获取用户输入的开始和结束日期
    start_date_str = request.form['start_date']
    end_date_str = request.form['end_date']

    excel_file_electricity = 'train_data.xlsx'
    # 要选择的列
    selected_columns01 = ['datetime', 'nat_demand']

    # 读取文件
    df_electricity = pd.read_excel(excel_file_electricity, usecols=selected_columns01)

    df_train = df_electricity.copy()
    df_train.set_index('datetime', inplace=True)

    # 导入模型并预测
    # model = Electric_Model(df_train=df_train)
    model_electricity = load_model("my_model_LSTM_Attention.h5", compile=False)

    # 使用pandas读取Excel文件
    # df = pd.read_excel(excel_file, engine='openpyxl', usecols=selected_columns01)
    df_electricity['datetime'] = pd.to_datetime(df_electricity['datetime'], format='%Y/%m/%d %H:%M')
    df_electricity.set_index('datetime', inplace=True)

    # 将字符串转换为datetime对象
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d %H:%M')

    # 计算两个日期之间的差异，并获取每小时的间隔数量
    delta = end_date - start_date
    total_interval = int(delta.total_seconds() / 3600)

    # 处理数据
    # 电力数据归一化
    data_scaler = StandardScaler()
    df_data_scaled = data_scaler.fit_transform(df_electricity)
    time_step = 24 * 15
    X, y = create_dataset(df_data_scaled, time_step)
    X = X.reshape(X.shape[0], X.shape[1], X.shape[2])

    # 最后一个时间步的数据
    last_data_electricity = X[-1:]

    # 预测未来的电力数据
    predictions_electricity = []

    for i in range(int(total_interval)):
        # 预测下一个时间步的电力数据
        prediction = model_electricity.predict(last_data_electricity.reshape(1, time_step, 1))
        print("prediction:  ", prediction)
        predictions_electricity.append(prediction)
        # 对要进行预测的数据进行归一化
        prediction = np.array(prediction).reshape(1, -1)

        last_data_electricity = np.array(last_data_electricity)
        last_data_electricity = np.append(last_data_electricity, prediction)
        last_data_electricity = last_data_electricity[1:]

    # 未来 15 天的电力数据预测值
    predictions_electricity = np.array(predictions_electricity)
    predictions_electricity = predictions_electricity.reshape((int(total_interval), 1))
    predictions_electricity = data_scaler.inverse_transform(predictions_electricity).flatten()
    predictions_electricity = predictions_electricity.tolist()
    print('predictions_electricity: ', predictions_electricity)
    # 设置预测的时间段
    pre_dates = pd.date_range(start=start_date, periods=total_interval, freq='H')

    datetime_list = pre_dates.strftime('%Y-%m-%d %H:%M').tolist()

    # 电价预测
    print('开始电价预测')
    # 获取上传的Excel文件
    excel_file = 'data.xlsx'

    # 选择要导入的属性
    selected_columns = ['date',
                        'electricity_price (PLN/MWh)',
                        'energy_demand (MW)',
                        'energy_from_wind_sources (MW)',
                        'is_holiday',
                        'code_of_the_day',
                        'electricity_price (PLN/MWh) lag24',
                        'electricity_price (PLN/MWh) lag48',
                        'electricity_price (PLN/MWh) lag72',
                        'electricity_price (PLN/MWh) lag96',
                        'electricity_price (PLN/MWh) lag120',
                        'electricity_price (PLN/MWh) lag144',
                        'electricity_price (PLN/MWh) lag168',
                        'electricity_price (PLN/MWh) lag336',
                        'energy_demand (MW) lag24',
                        'energy_demand (MW) lag48',
                        'energy_demand (MW) lag72',
                        'energy_demand (MW) lag96',
                        'energy_demand (MW) lag120',
                        'energy_demand (MW) lag144',
                        'energy_demand (MW) lag168',
                        'energy_demand (MW) lag336',
                        'energy_from_wind_sources (MW) lag24',
                        'energy_from_wind_sources (MW) lag48',
                        'energy_from_wind_sources (MW) lag72',
                        'energy_from_wind_sources (MW) lag96',
                        'energy_from_wind_sources (MW) lag120',
                        'energy_from_wind_sources (MW) lag144',
                        'energy_from_wind_sources (MW) lag168',
                        'energy_from_wind_sources (MW) lag336']

    # 预测
    df = pd.read_excel(excel_file, usecols=selected_columns)
    data_time = df['date'].dt.strftime('%Y-%m-%d %H:%M:%S').tolist()
    data_price = df['electricity_price (PLN/MWh)'].tolist()
    df = df.set_index(['date'])
    features = list(df.columns.difference(['electricity_price (PLN/MWh)']))
    target_mean = df['electricity_price (PLN/MWh)'].mean()
    target_stdev = df['electricity_price (PLN/MWh)'].std()

    # Standardize data
    df_ = standardization(df, 'electricity_price (PLN/MWh)')
    df = df_.reset_index(drop=False)

    # Split data
    df_train, df_val, df_test = train_validate_test_split(df, 0.0824)
    df_train = df_train.set_index(['date'])
    df_val = df_val.set_index(['date'])
    df_test = df_test.set_index(['date'])

    train_dataset = SequenceDataset(
        df_train,
        target='electricity_price (PLN/MWh)',
        features=features,
        sequence_length=5
    )

    val_dataset = SequenceDataset(
        df_val,
        target='electricity_price (PLN/MWh)',
        features=features,
        sequence_length=5
    )

    test_dataset = SequenceDataset(
        df_test,
        target='electricity_price (PLN/MWh)',
        features=features,
        sequence_length=5
    )

    val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

    num_inputs = len(features)

    # 创建一个与保存时相同结构的模型实例
    model_price = RNN(num_inputs, 256, 2, 1, 0.6)

    # 加载保存的状态字典
    model_price.load_state_dict(torch.load('model_weights.pth'))

    # 将模型设置为评估模式
    model_price.eval()

    train_eval_loader = DataLoader(train_dataset, batch_size=64, shuffle=False)

    ystar_col = "model forecast"
    df_train[ystar_col] = predict(train_eval_loader, model_price).numpy()
    df_val[ystar_col] = predict(val_loader, model_price).numpy()
    df_test[ystar_col] = predict(test_loader, model_price).numpy()
    df_out = pd.concat((df_train, df_val, df_test))[['electricity_price (PLN/MWh)', ystar_col]]

    df_pred = inverse_transform(df_out, target_stdev, target_mean)

    predictions_price = df_pred.iloc[-total_interval:]
    predictions_price = np.array(predictions_price).flatten().tolist()
    print(predictions_price)

    presentation_data = {'datetime_prediction': datetime_list, 'prediction_elec': predictions_electricity,
                         'prediction_price': predictions_price}
    data = {'electricity_price': data_price, 'date': data_time}
    # 返回渲染了预测结果的模板
    return render_template('electricity_pred.html', prediction_data=presentation_data, data_series=data)


# 返回文件
@app.route('/fetchPolData')
def fetch_Pol_data():
    # 指定文件所在的目录，这里假设 Excel 文件和 Flask 应用在同一个目录下
    file_path = 'POL.xlsx'
    try:
        # 发送文件，如果文件在 static 文件夹下，可以使用 app.static_folder
        return send_from_directory('.', file_path, as_attachment=True)
    except FileNotFoundError:
        # 如果文件不存在，返回 404 错误
        return "File not found", 404


@app.route('/fetchPANData')
def fetch_PAN_data():
    # 指定文件所在的目录，这里假设 Excel 文件和 Flask 应用在同一个目录下
    file_path = 'PAN.xlsx'
    try:
        # 发送文件，如果文件在 static 文件夹下，可以使用 app.static_folder
        return send_from_directory('.', file_path, as_attachment=True)
    except FileNotFoundError:
        # 如果文件不存在，返回 404 错误
        return "File not found", 404


@app.route('/fetchBELData')
def fetch_BEL_data():
    # 指定文件所在的目录，这里假设 Excel 文件和 Flask 应用在同一个目录下
    file_path = 'BEL.xlsx'
    try:
        # 发送文件，如果文件在 static 文件夹下，可以使用 app.static_folder
        return send_from_directory('.', file_path, as_attachment=True)
    except FileNotFoundError:
        # 如果文件不存在，返回 404 错误
        return "File not found", 404


# 提取数据(风力和光伏)并预测
@app.route('/trainWindAndSolar', methods=['GET', 'POST'])
def train_model_WindAndSolar():
    selected_columns01 = ['当地时间 布鲁塞尔(机场)', '气温', '风力', '光伏功率', '太阳辐射', '风力发电功率']

    # 获取Excel文件
    excel_file_train = 'WindAndSolar_history.xlsx'
    excel_file_pred = 'WindAndSolar_pred_weather.xlsx'

    # 获取用户输入的开始和结束日期
    start_date_str = request.form['start_date']
    end_date_str = request.form['end_date']

    # 加载数据
    xls = pd.read_excel(excel_file_train, usecols=selected_columns01)
    future = pd.read_excel(excel_file_pred, usecols=selected_columns01)

    # 数据预处理
    xls.fillna(method='ffill', inplace=True)
    future.fillna(method='ffill', inplace=True)

    scaler_weather = MinMaxScaler()
    scaler_target = MinMaxScaler()

    # 1. 处理时间列
    xls['时间'] = pd.to_datetime(xls['当地时间 布鲁塞尔(机场)'], format='%d.%m.%Y %H:%M', errors='coerce')
    xls['小时'] = xls['时间'].dt.hour
    xls['分钟'] = xls['时间'].dt.minute
    xls['周中日'] = xls['时间'].dt.dayofweek

    # 2. 处理预测时间列
    future['时间'] = pd.to_datetime(future['当地时间 布鲁塞尔(机场)'], format='%d.%m.%Y %H:%M', errors='coerce')
    future['小时'] = future['时间'].dt.hour
    future['分钟'] = future['时间'].dt.minute
    future['周中日'] = future['时间'].dt.dayofweek

    # 通过上面的代码将xls和future数据集准备好了，并且有以下特征：
    weather_data_Wind = xls[['风力', '小时', '分钟', '周中日']]  # 例子中使用了模拟的特征列
    weather_data_Solar = xls[['气温', '小时', '分钟', '周中日', '太阳辐射']]  # 例子中使用了模拟的特征列
    target = xls['风力发电功率']
    target = target.values.reshape(-1, 1)

    scaled_weather_data = scaler_weather.fit_transform(weather_data_Wind)
    scaled_target = scaler_target.fit_transform(target)

    # 序列化数据
    n_input = 3  # 这个值取决于您希望LSTM窗口的大小
    n_features_Wind = weather_data_Wind.shape[1]  # 特征数量
    n_features_Solar = weather_data_Solar.shape[1]  # 特征数量
    generator = TimeseriesGenerator(scaled_weather_data, scaled_target, length=n_input, batch_size=1)

    model_Wind = load_model('Bi-LSTM(70-100)-model(Wind).h5', custom_objects={'AttentionLayer': AttentionLayer})
    model_Solar = load_model('Bi-LSTM(70-100)-model(Solar0.64).h5', custom_objects={'AttentionLayer': AttentionLayer})

    # 预测未来的功率，确保future_weather_data的结构与训练时相同
    future_weather_data_Wind = future[['风力', '小时', '分钟', '周中日']]  # 示例
    scaled_weather_data_future = scaler_weather.fit_transform(future_weather_data_Wind)

    future_weather_data_Solar = future[['气温', '小时', '分钟', '周中日', '太阳辐射']]

    # 初始化一个空列表来存储预测值
    predictions_Wind = []
    predictions_Solar = []

    # 遍历风力测试数据，每次取n_input个时间点进行预测
    for i in range(len(scaled_weather_data_future) - n_input + 1):
        test_sample = scaled_weather_data_future[i:i + n_input].reshape(1, n_input, n_features_Wind)
        pred = model_Wind.predict(test_sample)
        predictions_Wind.append(pred[0][0])  # 添加预测值到列表

    # 遍历光伏测试数据，每次取n_input个时间点进行预测
    for i in range(len(future_weather_data_Solar) - n_input + 1):
        test_sample = future_weather_data_Solar.iloc[i:i + n_input].to_numpy().reshape(1, n_input, n_features_Solar)
        pred = model_Solar.predict(test_sample)
        predictions_Solar.append(pred[0][0])  # 添加预测值到列表

    predictions_array = np.array(predictions_Wind)
    predictions_invert = scaler_target.inverse_transform(predictions_array.reshape(-1, 1))
    predictions_invert = np.array([predictions_invert]).flatten().tolist()

    # 将字符串转换为datetime对象
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d %H:%M')

    # 计算两个日期之间的差异，并获取总小时数
    delta = end_date - start_date
    total_minutes = int(delta.total_seconds() // (30 * 60))
    # 如果需要包含结束时间，确保总分钟数是偶数，否则加1
    if total_minutes % 2 != 0:
        total_minutes += 1

    # 设置预测的时间段
    pre_dates = pd.date_range(start=start_date, periods=total_minutes, freq='30T')

    datetime_list = pre_dates.strftime('%Y-%m-%d %H:%M').tolist()

    prediction_data = {'datetime_prediction': datetime_list, 'prediction_Wind': predictions_invert,
                       'prediction_Solar': predictions_Solar}

    # 返回渲染了预测结果的模板
    return render_template('WindAndSolarPred.html', prediction_data=prediction_data)


if __name__ == '__main__':
    app.run(debug=True)

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
