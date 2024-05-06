//用电负荷预测
(function () {
    var myChart = echarts.init(document.querySelector(".electricity_prediction_line .chart"));
    var option = {
        grid: {
            left: '0%',
            top: '30px',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: predictionData.datetime_prediction,
            axisLabel:{//修改坐标系字体颜色
		        show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
	        },
        },
        yAxis: {
            type: 'value',
            axisLabel:{//修改坐标系字体颜色
		        show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
	        },
        },
        series: [
            {
                name: '预测用电负荷',
                type: 'line',
                data: predictionData.prediction_elec,
                lineStyle: {color: '#729DF2' ,width:1.7},
                itemStyle: {
                    color: '#729DF2'
                },
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ],
                    label: {
                        show: true,
                        color: 'white',
                        fontSize: 14
                    },
                },
                markLine: {
                    data: [{ type: 'average', name: 'Avg' }]
                }
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.setOption(option);
})();

//电价预测
(function () {
    var myChart = echarts.init(document.querySelector(".price_prediction_line .chart"));
    var option = {
        grid: {
            left: '0%',
            top: '30px',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: predictionData.datetime_prediction,
            axisLabel:{//修改坐标系字体颜色
		        show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
	        },
        },
        yAxis: {
            type: 'value',
            axisLabel:{//修改坐标系字体颜色
		        show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
	        },
        },
        series: [
            {
                name: '预测电价',
                type: 'line',
                data: predictionData.prediction_price,
                lineStyle: {color: '#729DF2' ,width:1.7},
                itemStyle: {
                    color: '#729DF2'
                },
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ],
                    label: {
                        show: true,
                        color: 'white',
                        fontSize: 14
                    },
                },
                areaStyle: {}
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.setOption(option);
})();