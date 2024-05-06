//历史风力等级分布
(function () {
    // prettier-ignore
    var dataAxis = ['0级', '1级', '2级', '3级', '4级', '5级', '6级', '7级', '8级', '9级', '10级', '11级', '12级', '13级', '14级', '15级','16级','17级','18级', '19级'];
    // prettier-ignore
    var data = [284, 2082, 3122, 3460, 2529, 2076, 1811, 1158, 747, 452, 296, 137, 80, 44, 28, 17, 10,17,2,0,1];
    var myChart = echarts.init(document.querySelector(".wind_level_bar .chart"));
    var option = {
        grid: {
            left: '0%',
            top: '10px',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                color: '#fff'
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        series: [
            {
                type: 'bar',
                showBackground: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 0.7, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' }
                        ])
                    }
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})();


//月度太阳辐射
(function () {
    // prettier-ignore
    var dataAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月'];
    // prettier-ignore
    var data = [112643, 115080, 219494, 263948, 328003, 305211, 291233, 216376, 197204, 125200, 114897,110193];
    var myChart = echarts.init(document.querySelector(".solar_dailysum_bar .chart"));
    var option = {
        grid: {
            left: '0%',
            top: '10px',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                color: '#fff'
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        series: [
            {
                type: 'bar',
                showBackground: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 0.7, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' }
                        ])
                    }
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})();


//月均风力等级
(function () {
    var myChart = echarts.init(document.querySelector(".wind_daily_line .chart"));
    var option = {
        axisLabel: {
            textStyle: {
                fontWeight: 'bold',
                color:"#FAFAFA"
            }
        },
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
            axisLabel:{//修改坐标系字体颜色
		        show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
	        },
            data:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} 级',
                show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        },
		        axisLabel:{//修改坐标系字体颜色
		            show:true,
		            textStyle:{
		            color:"#FAFAFA"
		            }
	            },
            }
        },
        series: [
            {
                name: '月均风级',
                type: 'line',
                data: [4.355324, 6.037500, 4.229818, 3.700941, 3.623047, 3.567876, 3.107422, 3.619141, 3.614247, 4.456380,4.295027,4.578776],
                lineStyle: {color: '#DC8B42' ,width:1.7},
                itemStyle: {
                    color: '#DC8B42',
                    fontWeight: 'bold'
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


//日均气温
(function () {
    var myChart = echarts.init(document.querySelector(".solar_daily_line .chart"));
    var option = {
        axisLabel: {
            textStyle: {
                fontWeight: 'bold',
                color:"#FAFAFA"
            }
        },
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
            axisLabel:{//修改坐标系字体颜色
		        show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
	        },
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} ℃',
                show:true,
		        textStyle:{
		        color:"#FAFAFA"
		        }
            }
        },
        series: [
            {
                name: '日均气温',
                type: 'line',
                data: [7.05, 8.85, 8.25, 11.10, 13.00, 15.38, 15.40, 16.41, 14.66, 11.47, 9.48, 8.78],
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
                },
                lineStyle: {color: '#64BC6B' ,width:1.7},
                itemStyle: {
                    color: '#64BC6B',
                    fontWeight: 'bold'
                },
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.setOption(option);
})();

//历史风力发电功率
(function () {
    var myChart = echarts.init(document.querySelector(".wind_year_rose .chart"));
    var option = {
        grid: {
            left: '0%',
            top: '30px',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '当月风力发电功率',
                type: 'pie',
                radius: [20, 100],
                center: ['50%', '50%'],
                roseType: 'radius',
                roseGap: '50%', // 设置花瓣之间的间隔
                itemStyle: {
                    borderRadius: 8,
                },
                data: [
                    { value: 2397512.08, name: '1月'},
                    { value: 2494980.26, name: '2月'},
                    { value: 2051486.81, name: '3月'},
                    { value: 1695086.21, name: '4月'},
                    { value: 1480371.13, name: '5月'},
                    { value: 1329715.38, name: '6月'},
                    { value: 967412.90, name: '7月'},
                    { value: 1463296.51, name: '8月'},
                    { value: 1557463.19, name: '9月'},
                    { value: 2324353.76, name: '10月'},
                    { value: 2197134.34, name: '11月'},
                    { value: 2491631.44, name: '12月'}
                ]
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.setOption(option);
})();

//历史光伏发电功率
(function () {
    var myChart = echarts.init(document.querySelector(".solar_year_rose .chart"));
    var option = {
        grid: {
            left: '0%',
            top: '30px',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '当月风力发电功率',
                type: 'pie',
                radius: [20, 100],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: [
                    { value: 395069.74, name: '1月' },
                    { value: 406179.53, name: '2月' },
                    { value: 840784.57, name: '3月' },
                    { value: 934510.03, name: '4月' },
                    { value: 1171606.13, name: '5月' },
                    { value: 1069917.35, name: '6月' },
                    { value: 1044991.37, name: '7月' },
                    { value: 737655.04, name: '8月' },
                    { value: 717250.93, name: '9月' },
                    { value: 456743.37, name: '10月' },
                    { value: 408136.32, name: '11月' },
                    { value: 399471.95, name: '12月' }
                ]
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.setOption(option);
})();

//风力发电功率预测
(function () {
    var myChart = echarts.init(document.querySelector(".wind_Prediction_line .chart"));
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
                name: '预测风力发电功率',
                type: 'line',
                data: predictionData.prediction_Wind,
                lineStyle: {color: '#729DF2' ,width:1.7},
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                showSymbol: 10,
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

//光伏发电功率预测
(function () {
    var myChart = echarts.init(document.querySelector(".solar_Prediction_line .chart"));
    var option = {
        axisLabel: {
            textStyle: {
                fontWeight: 'bold',
                color:"#FAFAFA"
            }
        },
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
                name: '预测光伏发电功率',
                type: 'line',
                data: predictionData.prediction_Solar,
                lineStyle: {color: '#729DF2' ,width:1.7},
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                areaStyle: {},

            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
    myChart.setOption(option);
})();