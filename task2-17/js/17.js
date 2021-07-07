/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(400),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(350),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(280)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    //if()
    document.getElementById('chart-inner').remove();
    var chart = chartData[pageState.nowSelectCity][pageState.nowGraTime];
    var chartBox = document.getElementById('chart-box');
    var chartInner = document.createElement('div');
    chartInner.id = 'chart-inner';
    chartInner.className = 'chart-inner '+pageState.nowGraTime;
    chartBox.appendChild(chartInner);
    for(var i = 0 ; i < chart.length; i++){
        var node = document.createElement('div');
        node.style.height = chart[i] + 'px';

        chartInner.appendChild(node);
        // console.log(node);
        // console.log(node.offsetLeft+','+node.offsetTop);
        var tipSpan = document.createElement('span');
        tipSpan.className = 'tipText';
        node.appendChild(tipSpan);

        // console.log(node.offsetLeft+','+node.offsetTop);

        tipSpan.style.display = 'none';
        tipSpan.innerHTML = Math.ceil(chart[i]) ;

        // 为每个div添加监听事件
        node.onmouseover = function(){
            this.getElementsByTagName('span')[0].style.display = 'block';
        };
        node.onmouseout = function(){
            this.getElementsByTagName('span')[0].style.display = 'none';
        };
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    var time = document.getElementById('form').time;
    
    for(var i = 0; i<time.length; i++){
        // 确定是否选项发生了变化
        console.log('nowGraTime');
        console.log(pageState.nowGraTime);
        console.log('checked');
        console.log(time[i].checked );
        console.log('value');
        console.log(time[i].value);

        if(time[i].checked && time[i].value !== pageState.nowGraTime){
            pageState.nowGraTime = time[i].value; 
            renderChart();
        }
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
        // 确定是否选项发生了变化
        // 设置对应数据
        pageState.nowSelectCity = document.getElementById('city-select').value;
        // 调用图表渲染函数
        renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var time = document.getElementById('form').time;
    for(var i = 0; i<time.length; i++){
        time[i].onclick = graTimeChange;
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = document.getElementById('city-select');
    for (var city in aqiSourceData){
        if(aqiSourceData.hasOwnProperty(city)){
            var cityOption = document.createElement('option');
            cityOption.value = cityOption.innerText = city;
            citySelect.appendChild(cityOption);
            citySelect.appendChild(cityOption);
        }
    }
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelect.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {

    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var month = [0,31,60,91];
    for(var city in aqiSourceData){
        var citydata= {},
            dayArr = [],
            weekArr =[],
            monthArr =[];
        var d = 1,
            dv = 0,
            w = 1,
            wv = 0,
            m = 1,
            mv = 0;
        for(date in aqiSourceData[city]){
            dv = aqiSourceData[city][date];
            dayArr.push(dv);
            wv += dv;
            mv += dv;
            d++;

            if(w < Math.floor(d/7) +1){
                weekArr.push(wv/7);
                w = Math.floor(d/7) + 1;
                wv = 0;
            }
            if( d === month[m]){
                monthArr.push(mv/(month[m]-month[m-1]));
                //alert(d,m);
                m ++ ;
                mv = 0;
            }
        }
        chartData[city] = citydata;
        citydata['day'] = dayArr;
        citydata['month'] = monthArr;
        citydata['week'] = weekArr;
    }
    console.log(aqiSourceData);
    console.log('chartData');
    console.log(chartData);
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
    renderChart();
}

init();