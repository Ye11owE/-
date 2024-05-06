//// 获取拖放区域元素
//const dropzone = document.getElementById('dropzone');
//
//// 文件拖入事件处理函数
//dropzone.addEventListener('dragover', (e) => {
//  e.preventDefault();
//  dropzone.classList.add('hover');
//});
//
//// 文件拖出事件处理函数
//dropzone.addEventListener('dragleave', () => {
//  dropzone.classList.remove('hover');
//});
//
//// 文件释放事件处理函数
//dropzone.addEventListener('drop', (e) => {
//  e.preventDefault();
//  dropzone.classList.remove('hover');
//  const files = e.dataTransfer.files;
//  handleFiles(files);
//});
//
//// 文件选择事件处理函数
//const fileInput = document.getElementById('file_input');
//fileInput.addEventListener('change', () => {
//  const files = fileInput.files;
//  handleFiles(files);
//});
//
//// 处理文件函数
//function handleFiles(files) {
//  if (files.length > 0) {
//    const file = files[0];
//    readXlsxFile(file);
//  }
//};
//
//// 点击拖放区域时触发文件选择
//dropzone.addEventListener('click', () => {
//  fileInput.click();
//});

//// 从xlsx文件中读取数据
//function readXlsxFile(file) {
//  var reader = new FileReader();
//  reader.onload = function (e) {
//    var data = new Uint8Array(e.target.result);
//    var workbook = XLSX.read(data, { type: 'array' });
//    var firstSheetName = workbook.SheetNames[0];
//    var worksheet = workbook.Sheets[firstSheetName];
//    var jsonData = XLSX.utils.sheet_to_json(worksheet);
//    // 调用绘制折线图函数
//    drawHistroyPrice(jsonData);
//    drawMonAvgPrice(jsonData);
//    drawMonRadar(jsonData);
//    drawMonParal(jsonData);
//  };
//  reader.readAsArrayBuffer(file);
//}

//// 解析Excel中的日期数据
//function parseExcelDate(excelDate) {
//  return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
//}

// 平均电价/负荷折线图
(function () {
  // 提取日期和平均电价、平均能源需求数据
  var dataAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月'];
  var prices = [197.5613, 192.8196, 190.44, 186.4155, 211.4852, 232.3719, 229.5264, 253.0283, 253.1169, 241.6407, 237.6093, 225.2895]; // 平均电价
  var demands = [1167.2475, 1175.0276, 1192.545, 1187.8152, 1187.367, 1191.6061, 1182.465384, 1189.93, 1180.7685, 1183.071, 1148.6424, 1205.6243]; // 平均能源需求

  // 获取图表容器
  var chartContainer = document.querySelector('.MonAvgPrice_line .chart');

  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(chartContainer);

  // 指定图表的配置项和数据
  var option = {
    textStyle: {
        fontWeight: 'bold'
    },
    grid: {
      left: '5%',
      top: '30px',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    legend: {
      top: 0,
      data: ['平均电价', '平均负荷'],
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dataAxis,
      axisLabel:{//修改坐标系字体颜色
		show:true,
		textStyle:{
		  color:"#FAFAFA"
		}
	  },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel:{//修改坐标系字体颜色
		    show:true,
		    textStyle:{
		    color:"#FAFAFA"
		    }
	    },
        name: '电价 (PLN/MWh)',
        nameTextStyle: {
                color: "#FAFAFA" // 设置名称的字体颜色
        }
      },
      {
        type: 'value',
        axisLabel:{//修改坐标系字体颜色
		    show:true,
		    textStyle:{
		    color:"#FAFAFA"
		    }
	    },
        name: '平均负荷 (MW)',
        nameTextStyle: {
                color: "#FAFAFA" // 设置名称的字体颜色
        },
        right: '0%',
      }
    ],
    series: [{
      name: '平均电价',
      data: prices,
      type: 'line',
      lineStyle: {color: '#DC8B42' ,width:1.7},
      itemStyle: {
        color: '#F89235' // Set the same color as the line
      },
      yAxisIndex: 0
    },
    {
      name: '平均负荷',
      data: demands,
      type: 'line',
      lineStyle: {color: '#64BC6B' ,width:1.7},
      itemStyle: {
        color: '#64BC6B' // Set the same color as the line
      },
      yAxisIndex: 1
    }]
  };

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);
})();

// 绘制各月份负荷与风力发电占比图
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".MonSumElec_radar .chart"));

  // 指定图表的配置项和数据
  var option = {
    textStyle: {
        fontWeight: 'bold'
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '2018.1' },
        { name: '2018.2' },
        { name: '2018.3' },
        { name: '2018.4' },
        { name: '2018.5' },
        { name: '2018.6' },
        { name: '2018.7' },
        { name: '2018.8' },
        { name: '2018.9' },
        { name: '2018.10' },
        { name: '2018.11' },
        { name: '2018.12' },
        { name: '2019.1' },
        { name: '2019.2' },
        { name: '2019.3' },
        { name: '2019.4' },
        { name: '2019.5' },
        { name: '2019.6' },
        { name: '2019.7' },
        { name: '2019.8' },
        { name: '2019.9' },
        { name: '2019.10' },
        { name: '2019.11' },
        { name: '2019.12' },
        { name: '2020.1' },
        { name: '2020.2' },
        { name: '2020.3' },
        { name: '2020.4' },
        { name: '2020.5' },
        { name: '2020.6' },
        { name: '2020.7' },
        { name: '2020.8' },
        { name: '2020.9' },
        { name: '2020.10' },
        { name: '2020.11' },
        { name: '2020.12' },
      ],
      axisLabel: {
        textStyle: {
            fontWeight: 'bold',
            color:"#FAFAFA"
        }
    }
    },
    tooltip: {
  padding: 10,
  borderWidth: 1,
  // 配置触发类型，'item'表示数据项图形触发
  trigger: 'item',
},
    legend: {
      bottom: -5,
      data: ['负荷', '风力发电'],
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    series: [
      {
        name: '负荷 vs 风力发电',
        type: 'radar',

        data: [
          {
            value: [119511.47, 125946.89, 153591.22, 129874.46, 165138.19, 165047.65, 168607.22, 193715.01, 196705.41, 189656.69, 182278.19, 170566.46, 179135.63, 144404.19, 148174.82, 163553.55, 178785.88, 180435.35, 178151.56, 198942.39, 175170.49, 171055.42, 155414.95, 140817.92, 142112.23, 123000.96, 123298.06, 109229.55, 128110.95, 156440.31, 165544.18, 172101.78, 174856.7, 178629.93, 175542.93, 169834.0],
            name: '负荷',
            itemStyle: { color: '#EA9C45' }
          },
          {
            value: [1704803, 584370, 1081327, 1258608, 770389, 719260, 594187, 651890, 941070, 1422054, 983648, 1440376, 1529283, 1521140, 1791171, 1186179, 916559, 709525, 875329, 546203, 1151174, 1142534, 1335910, 1721660, 1875101, 2132624, 1460334, 1185832, 1069968, 688968, 818508, 641196, 873480, 1294930, 1291142, 1483870],
            name: '风力发电',
            itemStyle: { color: '#64BC6B' }
          }
        ]
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);
})();

//平行坐标图
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".monAvg_paral .chart"));
  var data18 = [[1, 160.8498923283984, 20754.27590847914, 2294.485868102288], [2, 187.42096726190476, 21409.714285714286, 869.5982142857143], [3, 206.439811827957, 20786.676075268817, 1453.396505376344], [4, 180.38119444444445, 18344.265277777777, 1748.0666666666666], [5, 221.95993279569893, 17974.74059139785, 1035.4690860215053], [6, 229.2328472222222, 18712.525, 998.9722222222222], [7, 226.62260752688172, 18698.764784946237, 798.638440860215], [8, 260.3696370967742, 18828.31989247312, 876.1962365591398], [9, 273.2019583333333, 18930.57222222222, 1307.0416666666667], [10, 254.9149059139785, 19646.235215053763, 1911.3629032258063], [11, 253.1641527777778, 20344.036111111112, 1366.1777777777777], [12, 229.2559946236559, 20307.09677419355, 1935.989247311828]]
  var data19 = [[1, 240.77369623655915, 21325.575268817203, 2055.4879032258063], [2, 214.8871875, 20660.063988095237, 2263.6011904761904], [3, 199.15970430107527, 19803.168010752688, 2407.4879032258063], [4, 227.15770833333332, 18621.116666666665, 1647.4708333333333], [5, 240.30360215053764, 18338.611559139787, 1231.9341397849462], [6, 250.60465277777777, 18628.99722222222, 985.4513888888889], [7, 239.45102150537633, 18410.247311827956, 1176.5174731182797], [8, 267.395685483871, 18260.825268817203, 734.1438172043011], [9, 243.29234722222222, 18590.716666666667, 1598.8527777777779], [10, 229.9131989247312, 19604.942204301075, 1535.6639784946237], [11, 215.85409722222224, 19817.256944444445, 1855.4305555555557], [12, 189.27139784946237, 19646.68682795699, 2314.059139784946]]
  var data20 = [[1, 191.011061827957, 20395.051075268817, 2520.2970430107525], [2, 176.72551724137932, 20333.05172413793, 2500.114942528736], [3, 165.72319892473118, 19115.370967741936, 1962.8145161290322], [4, 151.70770833333333, 16818.269444444446, 1646.9888888888888], [5, 172.1921370967742, 16816.94623655914, 1438.1290322580646], [6, 217.27820833333334, 17485.147222222222, 956.9], [7, 222.5056182795699, 17895.40053763441, 1100.1451612903227], [8, 231.31959677419354, 18054.333333333332, 861.8225806451613], [9, 242.85652777777779, 18683.230555555554, 1213.1666666666667], [10, 240.09399193548387, 19772.07123655914, 1740.497311827957], [11, 243.80962499999998, 20174.845833333333, 1793.2527777777777], [12, 262.0895061728395, 20680.930555555555, 2289.9228395061727]]
  var schema = [
    { name: '月份', index: 0, text: '月份'},
    { name: '电价', index: 1, text: '电价'},
    { name: '能源需求', index: 2, text: '能源需求'},
    { name: '风能', index: 3, text: '风能'}
];
  var lineStyle = {
    width: 1,
    opacity: 0.5
  };
  option = {
    textStyle: {
        fontWeight: 'bold'
    },
    grid: {
      left: '3%',
      top: '0%',
      right: '0%',
      bottom: '3%',
      containLabel: true
    },
    // backgroundColor: '#333',
    tooltip: {
      padding: 10,
      // backgroundColor: '#222',
      // borderColor: '#777',
      borderWidth: 1
    },
    legend: {
      bottom: 0,
      data: ['2018年', '2019年', '2020年'],
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },

    parallelAxis: [
      {
        dim: 0,
        name: schema[0].text,
        nameTextStyle: {
                color: "#FAFAFA" // 设置名称的字体颜色
        },
        axisLabel: { textStyle: { fontWeight: 'bold', color: '#FAFAFA' } },
        axisLine: { lineStyle: { color: '#FAFAFA' } }
        // inverse: true,
        // max: 31,
        // nameLocation: 'start'
      },
      { dim: 1,
        name: schema[1].text,
        nameTextStyle: {
                color: "#FAFAFA" // 设置名称的字体颜色
        },
        axisLabel: { textStyle: { fontWeight: 'bold', color: '#FAFAFA' } },
        axisLine: { lineStyle: { color: '#FAFAFA' } }
      },
      { dim: 2,
        name: schema[2].text,
        nameTextStyle: {
                color: "#FAFAFA" // 设置名称的字体颜色
        },
        axisLabel: { textStyle: { fontWeight: 'bold', color: '#FAFAFA' } },
        axisLine: { lineStyle: { color: '#FAFAFA' } }
      },
      { dim: 3,
        name: schema[3].text,
        nameTextStyle: {
                color: "#FAFAFA" // 设置名称的字体颜色
        },
        axisLabel: { textStyle: { fontWeight: 'bold', color: '#FAFAFA' } },
        axisLine: { lineStyle: { color: '#FAFAFA' } }
      },
    ],
    parallel: {
      left: '5%',
      right: '15%',
      bottom: '12%',
      top: '12%',
      parallelAxisDefault: {
        type: 'value',
        name: '值',
      }
    },

    series: [
      {
        name: '2018年',
        type: 'parallel',
        lineStyle: {color: '#F89235' ,width:1.7},
        data: data18,
      },
      {
        name: '2019年',
        type: 'parallel',
        lineStyle: {color:'#00D6FF', width:1.7},
        data: data19
      },
      {
        name: '2020年',
        type: 'parallel',
        lineStyle: {color:'#64BC6B', width:1.7},
        data: data20
      }
    ]
  };
  myChart.setOption(option);
})();

// 绘制折线图
(function () {
  // 提取需要的列数据
  var Data = data.electricity_price;
  var Time = data.date;

  // 获取图表容器
  var chartContainer = document.querySelector('.historyPrice .chart');

  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(chartContainer);

  // 指定图表的配置项和数据
  var option = {
    textStyle: {
        fontWeight: 'bold'
    },
    grid: {
      left: '0%',
      top: '10px',
      right: '0%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
    //   position: function (pt) {
    //     return [pt[0], '10%'];
    //   },
      formatter: '{b0}<br />{c0} PLN/MWh'
    },
    xAxis: {
      type: 'category',
      data: Time,
      axisLabel:{//修改坐标系字体颜色
		show:true,
		textStyle:{
		  color:"#FAFAFA"
		}
	  },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel:{//修改坐标系字体颜色
		show:true,
		textStyle:{
		  color:"#FAFAFA"
		}
	  },
    //   axisLabel: {
    //     formatter: '{value} PLN/MWh'
    //   }
    },
    dataZoom: [
      {
        type: 'inside',

        start: 0,
        end: 20
      },
      {
        show: false,
        start: 0,
        end: 20
      }
    ],
    series: [{
      data: Data,
      smooth: true,
      type: 'line',
      lineStyle: {color: '#64BC6B' ,width:1.7},
      itemStyle: {
        color: '#64BC6B'
      },
    }]
  };

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);
})()

