import { MetricsPanelCtrl } from 'app/plugins/sdk'
import kbn from 'app/core/utils/kbn'
import _ from 'lodash'
import * as svg from './svg.js'
import $ from 'jquery'
import ChangeFont from './fontsize';
// import ChangeFont from 'app/core/utils/fontsize';
export class WaterRate extends MetricsPanelCtrl {
    constructor($scope, $injector, $rootScope) {
        super($scope, $injector)
        this.$rootScope = $rootScope
        this.hiddenSeries = {}
        this.dataType = 'timeseries'
        this.dictFontCalc = {}
        this.unitFormats = ''
        this.dateTime = new Date().getTime()
        this.timestamp = Math.floor(this.dateTime / 100)
        this.fontCalc = ChangeFont.defaultValues;
        this.fontCalc.forEach((item, index) => {
            this.dictFontCalc[this.fontCalc[index].text] = this.fontCalc[index]
        })

        var panelDefaults = {
            ratiotitleSize:'120%',
            ratiovalueSize:'200%',
            processedvalueSize:'120%',
            processedtitleSize:'120%',
            exceptedtitleSize:'120%',
            exceptedvalueSize:'120%',
            WaterType : 'original',
            dataSetting: [],
            WaterType : 'original',
            iconType : 'none',
            language:'en',//Default
            radarId: 'drawing' + this.timestamp,
            radarToolTipId: 'tooltips-' + this.panel.radarId,
            rowDatas: {},
            lang:'',//Default
            rowData:[],
            tagsNum: 0,
            tagsName: [],
            tagsValue: [],
            tagsNameEdited: [],
            tagsNameCombine: [],
            exceptedfontSize: '100%',
            processedfontSize: '100%',
            circlefontSize:'100%',
            seperateSize:'100%',
            seperateColor:'#00ffff',
            exceptedcssFontSize: '27px',
            processedcssFontSize : '27px',
            processedcssvalueSize:'35px',
            processedcsstitleSize:'35px',
            exceptedcssvalueSize:'35px',
            exceptedcsstitleSize:'35px',
            ratiocsstitleSize :'35px',
            ratiocssvalueSize :'65px',
            circlecssFontSize: '27px',
            decimals:"",//////
            fontColor: '#ffffff',
            adjustTableFontSize: false,
            isExceptedTextBold: false,
            isProcessedTextBold: false,
            isCircleTextBold: false,

            isexceptedtitleBold: false,
            isexceptedvalueBold: false,
            isprocessedtitleBold: false,
            isprocessedvalueBold: false,
            isratiovalueBold: false,
            isratiotitleBold: false,

            format: 'none',
            decimals: '',
            rangeOfVaule: '',
            isHighlight: true,
            isShowlegend: true,
            legendDisplay: "",
            radarHeight: "height:100%",
            legendColor: [],
            legendText: [],
            polygonColor: [],
            currentMetrics: [],
            currentTheme: '',
            hoverDisplay: 'none!important',
            tipBackgroundColor: '',
            // excepted: '預期水量',
            // processed :'已處理',
            exceptedfontColor :'#FFFFFF',
            exceptedtitleColor :'#00ffff',
            exceptedvalueColor :'#FFFFFF',

            processedfontColor :'#FFFFFF',
            processedtitleColor :'#00ffff',
            processedvalueColor :'#FFFFFF',

            ratiotitleColor:'#00ffff',

            circlefontColor :'#33CCFF',
            sidecolors:['#299c46', 'rgba(237, 129, 40, 1)', '#d44a3a'],
            textcolors:['#299c46', 'rgba(237, 129, 40, 1)', '#d44a3a'],
            valueFontColor:'#33CCFF',
            textFontColor:'#FFFFFF',
            resultData: [],
            enExceptedTitle:'Max Level',
            twExceptedTitle:'最大水量',
            cnExceptedTitle:'最大水量',
            enProcessedTitle:'Cur Level',
            twProcessedTitle:'目前水量',
            cnProcessedTitle:'目前水量',
            dataarr:[],
            // unitarr:[],
            sourceunit:['',''],
            thresholds:[],
            thresholds1:[],
            isCheckUnit:false,

        }
        //支持多語言
        if (this.dashboard.meta.language) {
            this.panel.lang = this.dashboard.meta.language;
        }else{
            this.panel.lang = 'en'
        }
        if (this.scope.$$listeners.isWisePaas) {
            _.defaults(this.panel, panelDefaults)
            this.events.on('data-received', this.onDataReceived.bind(this))
            this.events.on('data-error', this.onDataError.bind(this))
            this.events.on('init-edit-mode', this.onInitEditMode.bind(this))
        }
    }

    onInitEditMode() {
        this.panel.fontSize = this.formatFont(this.dictFontCalc[this.formatFont(this.panel.fontSize)].text)
        this.addEditorTab('Editor', 'public/plugins/advantech-water-achieving-rate3/partials/editor.html', 4)//只留editor
        this.unitFormats = kbn.getUnitFormats()
    }

    onDataError(err) {
        console.log("error:" + err)
    }

    onDataReceived(dataList) {
        this.getTheme()
        this.panel.tagsName = []
        this.panel.tagsValue = []
        this.panel.legendText = []
        this.panel.legendColor = []
        this.panel.currentMetrics = []
        this.panel.dataarr = [];
        let arr = [];
        
        let data = dataList;
        let dataSetComplate = false
       
        if (_.isEmpty(dataList)) {
            this.clearDraw()
            this.throwError('Please input query statement')
        }

        if (dataList.length > 0 && dataList[0].target) {//判斷輸入的資料數是否為2
            if (dataList.length == 2){
                dataSetComplate = true
                //去掃回傳值, 如果key是datapoint則不做任何事 ex:unit/desc...等等
                //dataarr是給set datasource unit用的
                for(var i = 0; i<data.length; i++){
                    this.panel.obj = {}
                    arr = Object.keys(data[i])//取key得名字
                    for(var j = 0; j<arr.length; j++){
                        if(arr[j]=='datapoints'){
                        }else{
                            this.panel.obj[arr[j]]= data[i][arr[j]]//物件{回傳值key:回傳值value}
                        }
                    }
                    this.panel.dataarr.push(this.panel.obj)//push到陣列dataarr裡面
                }

            }else if(dataList.length == 1){
                this.clearDraw()
                this.throwError('The dataList.length should be 2')
            }else if(dataList.length > 2){
                this.clearDraw()
                this.throwError('The dataList.length should be 2')
            }
        }
        if (dataSetComplate) {
            //this.check_cookie_name('language')//多語言,檢查cookie
            this.chengeLegenColor(false)
            this.panel.resultData = dataList;
            this.setUnitFormat(this.panel.format)//設定單位
            this.setFontSize()//所有文字屬性的變化以及render圖片
            this.renderTheColor()
        }
    }
    
    getTheme() {
        let theme = $('.radar-theme').css("color")
        if (theme == 'rgb(169, 169, 169)') {
            this.panel.currentTheme = 'dark'
            this.panel.tipBackgroundColor = 'rgba(50, 50, 50, 0.7)'
        } else {
            this.panel.currentTheme = 'light'
            this.panel.tipBackgroundColor = 'rgba(245, 245, 245, 0.7)'
        }
    }

    throwError(msg) {
        const error = new Error()
        error.message = msg
        error.data = msg
        throw error
    }

    clearDraw() {
        let drawArea = SVG(this.panel.radarId)
        drawArea.clear()
    }

    dataParse(columnsData, rowValue) {
        let metric = ""
        let value = {}
        let randomColor = ""
        for (let i = 0; i < rowValue.length; i++) {
            let haveMetric = false
            value = new Object()
            columnsData.forEach((item, index) => {
                if (columnsData[index].text.toLowerCase() != 'metric') {
                    value[columnsData[index].text] = rowValue[i][index]
                    if (i == 0 && this.panel.tagsName.length < columnsData.length - 1) {
                        this.panel.tagsName.push(columnsData[index].text)
                    }
                } else {
                    haveMetric = true
                    metric = rowValue[i][index].toString()
                    this.panel.currentMetrics.push(rowValue[i][index].toString())
                }
            })
            if (this.panel.rowDatas[metric]) {
                this.panel.rowDatas[metric].value = Object.values(value)
            } else {
                randomColor = this.getRandomColor()
                this.panel.rowDatas[metric] = { "value": Object.values(value), "color": randomColor, "legendText": metric, "editLegendText": "", "showLegendText": "", "textDecration": "none" }
            }
        }
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    removeKeys(currentMetrics) {
        let dataMetrics = Object.keys(this.panel.rowDatas)
        let outOfRange = this.arrDiff(currentMetrics, dataMetrics)
        if (outOfRange) {
            outOfRange.forEach((item) => {
                delete this.panel.rowDatas[item]
            })
        }
    }

    arrDiff(a1, a2) {
        let a = [], diff = []
        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true
        }
        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]]
            } else {
                a[a2[i]] = true
            }
        }
        for (let k in a) {
            diff.push(k)
        }
        return diff
    }

    formatFont(fontSize) {//分析字體大小
        let fontPercent = ''

        if (fontSize == null || fontSize == '100%') {
            fontPercent = '100%'
        } else if (fontSize.indexOf('string') == 0) {
            fontPercent = fontSize.replace('string:', '')
        } else {
            fontPercent = fontSize
        }
        return fontPercent
    }

    drawRadar() {//畫圖
        const diameter = 400
        const radius = diameter / 2
        const origin = 300
        let numOfScales = 1
        let level = diameter / numOfScales
        let drawArea = SVG(this.panel.radarId).size('100%', '100%')
        drawArea.clear()

        while (numOfScales > 0) {
            this.drawCircle(drawArea, level * numOfScales, origin, numOfScales)//畫圓
            numOfScales--  
        }

        let pointPosition = []
        for (let pointNum = 0; pointNum < this.panel.tagsNum; pointNum++) {
            pointPosition[pointNum] = this.drawPoint(drawArea, radius, pointNum, this.panel.tagsNum, origin)
            if (this.panel.tagsNameEdited[pointNum]) {
                this.panel.tagsNameCombine[pointNum] = this.panel.tagsNameEdited[pointNum]
            } else {
                this.panel.tagsNameCombine[pointNum] = this.panel.tagsName[pointNum]
            }
            this.drawText(drawArea, pointPosition[pointNum], this.panel.tagsNameCombine[pointNum], this.panel.fontColor, pointNum)
        }

        let maxValues = this.largestVaule(this.panel.tagsValue)
        let maxValue = Math.max(...maxValues)
  
        let polygonPosition = []
        let linePositions = []
        let centerPoint = '300,300'

        for (let polygonNum = 0; polygonNum < this.panel.tagsValue.length; polygonNum++) {
            let positions = ''
            let polygonPositionArray = []
            for (let pointNum = 0; pointNum < this.panel.tagsNum; pointNum++) {
                let position = this.setPolygonPosition(radius, pointNum, this.panel.tagsNum, this.panel.tagsValue[polygonNum], maxValue, origin)
                positions += position + ' '
                polygonPositionArray[pointNum] = position
                polygonPosition[polygonNum] = positions
            }

            let linePosition = []
            for (let pointNum = 0; pointNum < this.panel.tagsNum; pointNum++) {
                let positionCount = 0
                if (pointNum == 0 && polygonPositionArray[this.panel.tagsNum - 1] == centerPoint && polygonPositionArray[pointNum + 1] == centerPoint && polygonPositionArray[pointNum] != centerPoint) {
                    linePosition[positionCount] = polygonPositionArray[pointNum]
                }
                else if (polygonPositionArray[pointNum - 1] == centerPoint && polygonPositionArray[pointNum + 1] == centerPoint && polygonPositionArray[pointNum] != centerPoint) {
                    linePosition[positionCount] = polygonPositionArray[pointNum]
                } else if (pointNum == (this.panel.tagsNum - 1) && polygonPositionArray[pointNum - 1] == centerPoint && polygonPositionArray[0] == centerPoint && polygonPositionArray[pointNum] != centerPoint) {
                    linePosition[positionCount] = polygonPositionArray[pointNum]
                }
                positionCount++
            }
            linePositions[polygonNum] = linePosition
        }

        for (let i = 0; i < this.panel.legendColor.length; i++) {
            if (this.panel.legendColor[i].indexOf('#') == 0) {
                if (this.panel.legendColor[i].length == 7 || this.panel.legendColor[i].length == 4) {
                    this.panel.polygonColor[i] = this.hexToRgbA(this.panel.legendColor[i])
                } else {
                    this.throwError('Bad Hex, Please enter the color hex or rgb correctly.')
                }
            } else if (this.panel.legendColor[i].indexOf('rgba(') == 0) {
                this.panel.legendColor[i] = this.panel.legendColor[i]
                this.panel.polygonColor[i] = this.panel.legendColor[i]
            } else if (this.panel.legendColor[i].indexOf('rgb(') == 0) {
                this.panel.legendColor[i] = this.panel.legendColor[i].replace('rgb(', 'rgba(')
                this.panel.legendColor[i] = this.panel.legendColor[i].replace(')', ',0.5)')
                this.panel.polygonColor[i] = this.panel.legendColor[i]
            } else {
                this.throwError('Bad Hex, Please enter the color hex or rgb correctly.')
            }
        }
        polygonPosition.forEach((item, index) => {
            this.drawPolygon(drawArea, polygonPosition[index], this.panel.polygonColor[index])
            if (linePositions[index]) {
                this.formatLinePosition(drawArea, linePositions[index], this.panel.polygonColor[index], centerPoint)
            }
        })
        this.drawLegend()
        if (this.panel.isHighlight) {
            for (let pointNum = 0; pointNum < this.panel.tagsNum; pointNum++) {
                this.hoverLinePosition(drawArea, pointPosition[pointNum], centerPoint, pointNum)
            }
        }
    }

    drawCircle(drawArea, radius, originPosition, numOfScales) {
        let circleColor = ['rgba(78,78,78,1)', 'rgba(78,78,78,0.8)', 'rgba(78,78,78,0.6)', 'rgba(78,78,78,0.4)', 'rgba(78,78,78,0.2)']
        let pointColor = '#ffffff'
        if (this.panel.currentTheme == 'dark') {
            pointColor = '#1E1E1E'
        } else {
            pointColor = '#c8c8c8'
        }
        if(this.panel.isSideInformation==false){
            let circle = drawArea.circle(radius).attr({
                'fill': circleColor[numOfScales - 1],
                'stroke': pointColor,
                'stroke-width': '4px',
                cx: originPosition,
                cy: originPosition
            })
        }else{
            let circle = drawArea.circle(radius).attr({
                'fill': circleColor[numOfScales - 1],
                'stroke': pointColor,
                'stroke-width': '4px',
                cx: 225,
                cy: originPosition
            })
        }
        
    }

    drawPoint(drawArea, radius, pointNum, pointCount, xy) {
        let angle = 360 / pointCount
        let degree = -90 + (pointNum * angle)
        let radian = degree / (180 / Math.PI)
        let x = (radius * Math.cos(radian)) + xy
        let y = (radius * Math.sin(radian)) + xy
        let pointColor = '#ffffff'
        let stroke = ''
        let strokeWidth = '0px'
        if (this.panel.currentTheme == 'dark') {
            pointColor = '#ffffff'
            stroke = ''
            strokeWidth = '0px'
        } else {
            pointColor = '#adb5c4'
            stroke = '#c8c8c8'
            strokeWidth = '0.5px'
        }
        let circle = drawArea.circle(12).attr({
            'fill': pointColor,
            'stroke': stroke,
            'stroke-width': strokeWidth,
            cx: x,
            cy: y
        })
        return x + ',' + y
    }
    
    setFontSize() {//render所有屬性的變化
        //this.check_cookie_name('language')
        let dataList = this.panel.resultData;
        
        let valueFontColor = this.panel.valueFontColor == undefined ? "#33CCFF" : this.panel.valueFontColor
        let textFontColor = this.panel.textFontColor == undefined ? "#FFFFFF" : this.panel.textFontColor//圓裡面字體的顏色
      
        let exceptedfontColor = this.panel.exceptedfontColor;//if circle is original type
        let exceptedtitleColor = this.panel.exceptedtitleColor;//if circle is new type
        let exceptedvalueColor = this.panel.exceptedvalueColor;//if circle is new type

        let processedfontColor = this.panel.processedfontColor;//if circle is original type
        let processedtitleColor = this.panel.processedtitleColor;//if circle is new type
        let processedvalueColor = this.panel.processedvalueColor;//if circle is new type

        let ratiotitleColor = this.panel.ratiotitleColor;//if circle is new type


        //Excepted Title 多語言
        let enExceptedTitle = this.panel.enExceptedTitle;
        let twExceptedTitle = this.panel.twExceptedTitle;
        let cnExceptedTitle = this.panel.cnExceptedTitle;

        //Processed Title 多語言
        let enProcessedTitle = this.panel.enProcessedTitle;
        let twProcessedTitle = this.panel.twProcessedTitle;
        let cnProcessedTitle = this.panel.cnProcessedTitle;

        //讀取cookie裡面的語言
        let lang = this.panel.lang;
        let drawArea = SVG(this.panel.radarId)
      
        drawArea.clear()
        
        let cx = this.panel.WaterType === 'original' ? 300 : 0
        let cy = 300
        
        let r = 200
        let pathvalue  = 0
        let trianglevalue = 0
        let middleAngle = 90
        let isratiovalueBold = this.panel.isratiovalueBold;
        let isratiotitleBold = this.panel.isratiotitleBold;

        let isExceptedTextBold = this.panel.isExceptedTextBold;
        let isexceptedtitleBold = this.panel.isexceptedtitleBold;
        let isexceptedvalueBold = this.panel.isexceptedvalueBold;
        
        let isProcessedTextBold = this.panel.isProcessedTextBold;
        let isprocessedtitleBold = this.panel.isprocessedtitleBold;
        let isprocessedvalueBold = this.panel.isprocessedvalueBold;

        let isCircleTextbBold = this.panel.isCircleTextBold;

        let firstData = dataList[0].datapoints[0]//第一筆資料
        let secondData = dataList[1].datapoints[0]//第二筆資料
        let exceptedUnitWater = dataList[0].datapoints[1]//預期水量（含單位）
        let processedUnitWater = dataList[1].datapoints[1]//已處理水量（含單位）
        let exceptedWater;//預期水量（不含單位）
        let processedWater;//已處理水量（不含單位）

        if(typeof firstData == 'object' && typeof secondData =='object'){//有時傳進來的data是object有時候不是,所以用判斷式去判別
            exceptedWater = firstData[0]
            processedWater = secondData[0]
        }else{
            exceptedWater = firstData
            processedWater = secondData
        }
      
        let drawpercent = Math.floor(processedWater * 100 / exceptedWater)//因為含單位水量沒辦法比較, 所以用無單位比較
        let percentWater = (360 * drawpercent)/100
        let angle = percentWater/2
        let startAngle = middleAngle - angle
        let finalAngle =  middleAngle + angle            
        let x0 = this.panel.WaterType === 'original' ? 300+200*Math.cos(startAngle*Math.PI/180) : 0+200*Math.cos(startAngle*Math.PI/180) 
        let y0 = 300+200*Math.sin(startAngle*Math.PI/180)  
        let x1 = this.panel.WaterType === 'original' ? 300+200*Math.cos(finalAngle*Math.PI/180) : 0+200*Math.cos(finalAngle*Math.PI/180)
        let y1 = 300+200*Math.sin(finalAngle*Math.PI/180) 

        //var draw = SVG('drawing').size(1000, 1000)
        if(drawpercent <= 50){
            pathvalue = 'M' + cx + ' ' + cy +',' + 'L' + x0 + ' ' + y0  + 'A' + r + ' ' + r + ' 0 0 1 ' + x1 + ' ' + y1 + ' ' + 'Z'
            trianglevalue = x0 +','+ y0 +' '+ x1 +','+ y1 +' '+cx +','+ cy 

        }else if(drawpercent>50 && drawpercent<100){
            pathvalue = 'M' + cx + ' ' + cy +',' + 'L' + x0 + ' ' + y0  + 'A' + r + ' ' + r + ' 0 1 1 ' + x1 + ' ' + y1 + ' ' + 'Z' 
            trianglevalue = x0 +' '+ y0 +','+ x1 +' '+ y1 +','+cx +' '+ cy 
          
        }else{ 
            drawArea.circle(2*r).fill(valueFontColor.toString()).move(this.panel.WaterType === 'original' ? 100 : -200, 100)
        }
           var drapath = drawArea.path(pathvalue)
           drapath.fill(valueFontColor.toString())//.move(20, 20)
          // drapath.stroke({ color: '#33CCFF', width: 4, linecap: 'round', linejoin: 'round' })
           var dratri = drawArea.polygon(trianglevalue)
        if(drawpercent>50 && drawpercent<100){
            dratri.fill(valueFontColor.toString())//.move(20, 20)
            dratri.stroke({ color: valueFontColor.toString(), width: 4, linecap: 'round', linejoin: 'round' })
        }else if(drawpercent<=50){
            dratri.fill('#323233')
            dratri.stroke({ color: '#323233', width: 4, linecap: 'round', linejoin: 'round' })
        }
 
        drawArea.circle(2*r).fill('none').stroke({ color: valueFontColor.toString(), width: 7, linecap: 'round', linejoin:   'round' }).move(this.panel.WaterType === 'original' ? 100 : -200, 100)

        if(this.panel.WaterType === 'original'){
            drawArea.line(x1, y1, x1 - 90, y1).stroke({ width: 4 ,color: valueFontColor.toString()})//////////////
            drawArea.line(300,100 ,500 ,100 ).stroke({ width: 4 ,color: valueFontColor.toString()})
        }
        
        //字體大小初始化
        this.panel.exceptedfontSize = this.formatFont(this.panel.exceptedfontSize)
        this.panel.exceptedtitleSize = this.formatFont(this.panel.exceptedtitleSize)
        this.panel.exceptedvalueSize = this.formatFont(this.panel.exceptedvalueSize)

        this.panel.processedfontSize = this.formatFont(this.panel.processedfontSize)
        this.panel.processedtitleSize = this.formatFont(this.panel.processedtitleSize)
        this.panel.processedvalueSize = this.formatFont(this.panel.processedvalueSize)

        this.panel.ratiotitleSize = this.formatFont(this.panel.ratiotitleSize)
        this.panel.ratiovalueSize = this.formatFont(this.panel.ratiovalueSize)

        this.panel.circlefontSize = this.formatFont(this.panel.circlefontSize)

        if (this.panel.adjustTableFontSize) {//目前沒有開發adjust font, 所以此block為預留位置
            this.panel.exceptedcssFontSize = this.dictFontCalc[this.panel.exceptedfontSize].value
            this.panel.processedcssFontSize = this.dictFontCalc[this.panel.processedfontSize].value
            this.panel.circlecssFontSize = this.dictFontCalc[this.panel.circlefontSize].value
            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(70).size(this.panel.exceptedcssFontSize)
           // drawArea.text(exceptedUnitWater.toString()).fill(exceptedfontColor.toString()).dx(520).dy(105).size(this.panel.exceptedcssFontSize)
            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-225).dy(y1-30).size(this.panel.processedcssFontSize)
            //drawArea.text(processedUnitWater.toString()).fill(processedfontColor.toString()).dx(x1-225).dy(y1+10).size(this.panel.processedcssFontSize)
            
            if(this.panlel.WaterType === 'original'){//佔比放圓圈中間
                
                drawArea.text(drawpercent+'%').fill(textFontColor.toString()).dx(230).dy(400).size(this.panel.circlecssFontSize).font({
                weight: isCircleTextbBold ? 'bold':'normal',
                anchor:'middle'
            })
            }else if(this.panel.WaterType === 'new'){//圖片放圓圈中間
               
                if(this.panel.iconType === 'none'){
                    var image = drawArea.image('')
                    image.size(205, 205).move(-100,200)
                }
                else if(this.panel.iconType === 'oil'){
                    var image = drawArea.image('public/plugins/advantech-water-achieving-rate3/img/oil.svg')
                    image.size(205, 205).move(-100,200)
                }
                else if(this.panel.iconType === 'water'){
                    var image = drawArea.image('public/plugins/advantech-water-achieving-rate3/img/water.svg')
                    image.size(205, 205).move(-100,200)
                }
                else if(this.panel.iconType === 'temperature'){
                    var image = drawArea.image('public/plugins/advantech-water-achieving-rate3/img/Temperature.svg')
                    image.size(205, 205).move(-100,200)
                }
            }
        } else {//因為沒有adjust font,所以直接寄進來做判斷
           
            this.panel.exceptedcssFontSize = this.dictFontCalc[this.panel.exceptedfontSize].px
            this.panel.processedcssFontSize = this.dictFontCalc[this.panel.processedfontSize].px
            
            this.panel.processedcssvalueSize = this.dictFontCalc[this.panel.processedvalueSize].px
            this.panel.processedcsstitleSize = this.dictFontCalc[this.panel.processedtitleSize].px
           
            this.panel.exceptedcssvalueSize = this.dictFontCalc[this.panel.exceptedvalueSize].px
            this.panel.exceptedcsstitleSize = this.dictFontCalc[this.panel.exceptedtitleSize].px
           
            this.panel.ratiocssvalueSize = this.dictFontCalc[this.panel.ratiovalueSize].px
            this.panel.ratiocsstitleSize = this.dictFontCalc[this.panel.ratiotitleSize].px
            this.panel.circlecssFontSize = this.dictFontCalc[this.panel.circlefontSize].px

            if(this.panel.WaterType=='new'){
                drawArea.text(drawpercent+'%').fill(textFontColor.toString()).dx(520).dy(180).size(this.panel.ratiocssvalueSize).font({
                    weight: isratiovalueBold ? 'bold':'normal',
                    anchor: 'middle'
                   
                })
               
                switch(lang){//隨著語系去做文字轉換
                    case 'en' :
                        drawArea.text('Ratio').fill(ratiotitleColor.toString()).dx(520).dy(125).size(this.panel.ratiocsstitleSize).font({
                            weight: isratiotitleBold  ? 'bold':'normal',
                            anchor: 'middle'
                        })
                        drawArea.text(enExceptedTitle).fill(exceptedtitleColor.toString()).dx(640).dy(320).size(this.panel.exceptedcsstitleSize).font({
                            weight:isexceptedtitleBold ? 'bold': 'normal',
                            anchor: 'middle'
                        })
                        break;
                    case 'zh_tw' :
                        drawArea.text('佔比').fill(ratiotitleColor.toString()).dx(520).dy(125).size(this.panel.ratiocsstitleSize).font({
                            weight: isratiotitleBold  ? 'bold':'normal',
                            anchor: 'middle'
                        })
                        drawArea.text(twExceptedTitle).fill(exceptedtitleColor.toString()).dx(640).dy(320).size(this.panel.exceptedcsstitleSize).font({
                            weight:isexceptedtitleBold ? 'bold': 'normal',
                            anchor: 'middle'
                        })
                        break;
                    case 'zh_cn' :
                        drawArea.text('佔比').fill(ratiotitleColor.toString()).dx(520).dy(125).size(this.panel.ratiocsstitleSize).font({
                            weight: isratiotitleBold  ? 'bold':'normal',
                            anchor: 'middle'
                        })
                        drawArea.text(cnExceptedTitle).fill(exceptedtitleColor.toString()).dx(640).dy(320).size(this.panel.exceptedcsstitleSize).font({
                            weight:isexceptedtitleBold ? 'bold': 'normal',
                            anchor: 'middle'
                        })
                        break; 
                    default:
                        drawArea.text('Ratio').fill(ratiotitleColor.toString()).dx(520).dy(125).size(this.panel.ratiocsstitleSize).font({
                            weight: isratiotitleBold  ? 'bold':'normal',
                            anchor: 'middle'
                        })
                        drawArea.text(enExceptedTitle).fill(exceptedtitleColor.toString()).dx(640).dy(320).size(this.panel.exceptedcsstitleSize).font({
                            weight:isexceptedtitleBold ? 'bold': 'normal',
                            anchor: 'middle'
                        })
                 }
               
                drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedvalueColor.toString()).dx(640).dy(375).size(this.panel.exceptedcssvalueSize).font({
                    weight:isexceptedvalueBold ? 'bold': 'normal',
                    anchor: 'middle'
                })
               
                var line = drawArea.line(0, 110, 0, 170).move(520, 350)
                var size = this.panel.seperateSize
               
                var intsize
                if(size.indexOf('string:'>0)){
                    intsize = parseInt(size.replace('string:', '').replace('%',''))/100
                }else{
                    intsize = parseInt(size.replace('%',''))/100
                }
            
                line.stroke({ color: this.panel.seperateColor, width: 5*intsize, linecap: 'round' })
                switch(lang){
                    case 'en' :
                        drawArea.text(enProcessedTitle).fill(processedtitleColor.toString()).dx(400).dy(320).size(this.panel.processedcsstitleSize).font({
                            weight:isprocessedtitleBold? 'bold': 'normal',
                            anchor: 'middle'
                        })
                        break;
                    case 'zh_tw' :
                        drawArea.text(twProcessedTitle).fill(processedtitleColor.toString()).dx(400).dy(320).size(this.panel.processedcsstitleSize).font({
                            weight:isprocessedtitleBold? 'bold': 'normal',
                            anchor: 'middle'
                        })
                        break;
                    case 'zh_cn' :
                        drawArea.text(cnProcessedTitle).fill(processedtitleColor.toString()).dx(400).dy(320).size(this.panel.processedcsstitleSize).font({
                            weight:isprocessedtitleBold? 'bold': 'normal',
                            anchor: 'middle'
                        })
                        break; 
                    default:
                        drawArea.text(enProcessedTitle).fill(processedtitleColor.toString()).dx(400).dy(320).size(this.panel.processedcsstitleSize).font({
                            weight:isprocessedtitleBold? 'bold': 'normal',
                            anchor: 'middle'
                        })
                 }
                drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedvalueColor.toString()).dx(400).dy(375).size(this.panel.processedcssvalueSize).font({
                    weight:isprocessedvalueBold? 'bold': 'normal',
                    anchor: 'middle'
                })
                if(this.panel.iconType === 'oil'){
                    var image = drawArea.image('public/plugins/advantech-water-achieving-rate3/img/oil.svg')
                    image.size(205, 205).move(-100,200)
                }
                else if(this.panel.iconType === 'water'){
                    var image = drawArea.image('public/plugins/advantech-water-achieving-rate3/img/water.svg')
                    image.size(205, 205).move(-100,200)
                }
                else if(this.panel.iconType === 'temperature'){
                    var image = drawArea.image('public/plugins/advantech-water-achieving-rate3/img/Temperature.svg')
                    image.size(205, 205).move(-100,200)
                }
            }else if(this.panel.WaterType=='original'){
                drawArea.text(drawpercent+'%').fill(textFontColor.toString()).dx(300).dy(350).size(this.panel.circlecssFontSize).font({
                    weight: isCircleTextbBold ? 'bold':'normal',
                    anchor:'middle'
            })

            if(this.panel.exceptedfontSize == '200%'){//隨著文字大小判斷其位置
                    switch(language){//隨著語系去做文字轉換
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(50).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(50).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(50).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(50).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                    drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(120).size(this.panel.exceptedcssFontSize).font({
                        weight:isExceptedTextBold ? 'bold': 'normal'
                    })
            }else if(this.panel.exceptedfontSize == '220%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(45).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(45).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(45).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(45).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                   drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(120).size(this.panel.exceptedcssFontSize).font({
                       weight:isExceptedTextBold ? 'bold': 'normal'
                   })
                    
               
            }else if(this.panel.exceptedfontSize == '230%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(40).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(40).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(40).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(40).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                    drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(125).size(this.panel.exceptedcssFontSize).font({
                        weight:isExceptedTextBold ? 'bold': 'normal'
                    })               
            }else if(this.panel.exceptedfontSize == '180%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(55).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(55).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(55).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(55).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                    drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(120).size(this.panel.exceptedcssFontSize).font({
                        weight:isExceptedTextBold ? 'bold': 'normal'
                    })
            }else if(this.panel.exceptedfontSize == '160%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                    drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(115).size(this.panel.exceptedcssFontSize).font({
                        weight:isExceptedTextBold ? 'bold': 'normal'
                    })               
            }else if(this.panel.exceptedfontSize == '150%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                    drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(110).size(this.panel.exceptedcssFontSize).font({
                        weight:isExceptedTextBold ? 'bold': 'normal'
                    })
            }else if(this.panel.exceptedfontSize == '140%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(60).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                    drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(105).size(this.panel.exceptedcssFontSize).font({
                        weight:isExceptedTextBold ? 'bold': 'normal'
                    })
            }else {
                    switch(lang){
                        case 'en' :
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(65).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(65).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(65).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                            break; 
                        default:
                            drawArea.text(enExceptedTitle).fill(exceptedfontColor.toString()).dx(520).dy(65).size(this.panel.exceptedcssFontSize).font({
                                weight:isExceptedTextBold ? 'bold': 'normal'
                            })
                     }
                    drawArea.text(exceptedUnitWater.toString()+this.panel.sourceunit[0]).fill(exceptedfontColor.toString()).dx(520).dy(105).size(this.panel.exceptedcssFontSize).font({
                        weight:isExceptedTextBold ? 'bold': 'normal'
                    })
            }
            if(this.panel.processedfontSize == '200%'){//隨著文字大小判斷位置
                    switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-130).dy(y1-60).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })
            }else if(this.panel.processedfontSize == '220%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-125).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-130).dy(y1-50).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })   
            }else if(this.panel.processedfontSize == '230%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-135).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-135).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-135).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-130).dy(y1-135).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-130).dy(y1-50).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })
            }else if(this.panel.processedfontSize == '180%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-115).dy(y1-45).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })
            }else if(this.panel.processedfontSize == '160%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-115).dy(y1-45).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })
            }else if(this.panel.processedfontSize == '150%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-110).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-115).dy(y1-45).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })
            }else if(this.panel.processedfontSize == '140%'){
                    switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-80).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-80).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-80).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-115).dy(y1-80).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-115).dy(y1-15).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })
            }else {
                switch(lang){
                        case 'en' :
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-125).dy(y1-40).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_tw' :
                            drawArea.text(twProcessedTitle).fill(processedfontColor.toString()).dx(x1-125).dy(y1-40).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break;
                        case 'zh_cn' :
                            drawArea.text(cnProcessedTitle).fill(processedfontColor.toString()).dx(x1-125).dy(y1-40).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                            break; 
                        default:
                            drawArea.text(enProcessedTitle).fill(processedfontColor.toString()).dx(x1-125).dy(y1-40).size(this.panel.processedcssFontSize).font({
                                weight:isProcessedTextBold? 'bold': 'normal',
                                anchor: 'end'
                            })
                     }
                    drawArea.text(processedUnitWater.toString()+this.panel.sourceunit[1]).fill(processedfontColor.toString()).dx(x1-125).dy(y1).size(this.panel.processedcssFontSize).font({
                        weight:isProcessedTextBold? 'bold': 'normal',
                        anchor: 'end'
                    })
                }
            }
        }
    }
    
    limitThresholds(limit) {
        const dataSet = this.panel.resultData;
        const res = /^[0-9]+\b,[0-9]+$/;
        let result = [];

        if (limit == null || limit == '') {
            this.panel.thresholds = null;
            this.panel.valueFontColor = '#33CCFF';
            this.renderTheColor();
            return;
        }

        if (limit.toString().match(res)) {
            result = limit.toString().split(',');
            if (result.length > 0 && parseInt(result[0]) > parseInt(result[1])) {
                result.reverse();
                this.panel.thresholds = result;
                this.renderTheColor();
            } else {
                this.panel.thresholds = result;
                this.renderTheColor();
            }
        } else {
           
            this.panel.thresholds = limit;
            this.panel.valueFontColor = '#33CCFF';
            this.renderTheColor();
        }
    }

    limitThresholds1(limit) {
       
        const res = /^[0-9]+\b,[0-9]+$/;
        let result = [];

        if (limit == null || limit == '') {
          
            this.panel.thresholds1 = null;
            this.panel.textFontColor = '#FFFFFF';
            this.renderTheColor1();
            return;
        }

        if (limit.toString().match(res)) {
           
            result = limit.toString().split(',');
            if (result.length > 0 && parseInt(result[0]) > parseInt(result[1])) {
                result.reverse();
                this.panel.thresholds1 = result;
                this.renderTheColor1();
            } else {
                this.panel.thresholds1 = result;
                this.renderTheColor1();
            }
        } else {
           
            this.panel.thresholds1 = limit;
            this.panel.textFontColor = '#FFFFFF';
            this.renderTheColor1();
        }
    }

    onColorChange(index) {
        const dataSet = this.panel.resultData;
        if (typeof (dataSet.thresholds) == 'object') {
            this.renderTheColor(index);
        }
    }

    onColorChange1(index) {
        const dataSet = this.panel.resultData;
        if (typeof (dataSet.thresholds1) == 'object') {
            this.renderTheColor1(index);
        }
    }


    invertColorOrder() {
        const dataSet = this.panel.resultData;
        this.panel.sidecolors.reverse();
        if (typeof (dataSet.thresholds) == 'object') {
            this.renderTheColor(index);
        }
    }

    invertColorOrder1() {
        const dataSet = this.panel.resultData;
        this.panel.textcolors.reverse();
        if (typeof (dataSet.thresholds1) == 'object') {
            this.renderTheColor1(index);
        }
    }

    singleColorChange(index, order, color){
        const dataSet = this.panel.resultData;
        
        if(order == 1){
            dataSet.title1Color = color
        }else if(order == 2){
            dataSet.title2Color = color
        }
        
    }

    renderTheColor() {
        const dataSet = this.panel.resultData;
        const rowData = this.panel.rowData;
        if(this.panel.thresholds != null){
           
            const minThresholds = this.panel.thresholds[0];
            const maxThresholds = this.panel.thresholds[1];
            let firstData = dataSet[0].datapoints[0]
            let secondData = dataSet[1].datapoints[0]
            let exceptedWater = firstData
            let processedWater = secondData
            const value = processedWater[0];
            if (value <= minThresholds) {
                this.panel.valueFontColor = this.panel.sidecolors[0];
            } else if (value > minThresholds && value <= maxThresholds) {
                this.panel.valueFontColor = this.panel.sidecolors[1];
            } else{
                this.panel.valueFontColor = this.panel.sidecolors[2]; 
            }
        }
        else{
            this.panel.valueFontColor = '#33CCFF';
        }
        this.setFontSize();//重新畫圖
    }

    renderTheColor1() {
        const dataSet = this.panel.resultData;
  
        if(this.panel.thresholds1 != null){
            const minThresholds1 = this.panel.thresholds1[0];
            const maxThresholds1 = this.panel.thresholds1[1];
            let firstData = dataSet[0].datapoints[0]
            let secondData = dataSet[1].datapoints[0]
            let exceptedWater = firstData
            let processedWater = secondData
            const value1 = processedWater[0]
            let drawpercent = Math.floor(value1 * 100 / exceptedWater[0])
            if (drawpercent <= minThresholds1) {
                this.panel.textFontColor = this.panel.textcolors[0];
            } else if (drawpercent > minThresholds1 && drawpercent <= maxThresholds1) {
                this.panel.textFontColor = this.panel.textcolors[1];
            } else{
                this.panel.textFontColor = this.panel.textcolors[2];   
            }
        }else{
            this.panel.textFontColor = '#FFFFFF';
        }
        this.setFontSize();//重新畫圖
    }
    
    drawText(drawArea, pointPosition, text, color, pointNum) {
        let nodes = this.panel.tagsNum
        let xy = pointPosition.split(',')
        let align = ''
        let fontWeight = 'normal'
        let formatFontSize = this.formatFont(this.panel.fontSize).replace('0%', '')
        if (this.panel.currentTheme == 'dark') {
            if (color == 'rgb(50,50,51)' || color == '#323233' || this.panel.fontColor == 'rgb(50,50,51)' || this.panel.fontColor == '#323233') {
                this.panel.fontColor = '#ffffff'
                color = '#ffffff'
            }
        } else if (this.panel.currentTheme == 'light') {
            if (this.panel.fontColor == 'rgb(255, 255, 255)' && color == 'rgb(255, 255, 255)' || color == '#ffffff' || this.panel.fontColor == '#ffffff') {
                this.panel.fontColor = '#323233'
                color = '#323233'
            }
        }

        if (!this.panel.isTextBold) {
            fontWeight = 'normal'
        } else {
            fontWeight = 'bold'
        }

        if (pointNum == (nodes / 2) || pointNum == 0) {
            align = 'middle'
        } else if (pointNum < (nodes / 2)) {
            align = 'start'
        } else if (pointNum > (nodes / 2)) {
            align = 'end'
        }

        //yongxin add
        if (this.dashboard.meta) {
            if (this.dashboard.meta.isPc === false) {
                this.panel.adjustTableFontSize = false;
                this.panel.cssFontSize = this.dictFontCalc[this.panel.fontSize].px
            }
        }

        if (this.panel.adjustTableFontSize) {
            if (pointNum == 0) {
                xy[1] = parseFloat(xy[1]) - (1.2 * formatFontSize)
            } else if ((pointNum / nodes) < 0.25) {
                xy[0] = parseFloat(xy[0]) + (1.2 * formatFontSize)
                xy[1] = parseFloat(xy[1]) - (0.8 * formatFontSize)
            } else if (pointNum / nodes == 0.25) {
                xy[0] = parseFloat(xy[0]) + (1.2 * formatFontSize)
                xy[1] = parseFloat(xy[1]) + (0.5 * formatFontSize)
            } else if (pointNum < nodes / 2 && (pointNum / nodes) > 0.25) {
                xy[0] = parseFloat(xy[0]) + (1.2 * formatFontSize)
                xy[1] = parseFloat(xy[1]) + (1.6 * formatFontSize)
            } else if (pointNum == nodes / 2) {
                xy[1] = parseFloat(xy[1]) + (2.2 * formatFontSize)
            } else if (pointNum > nodes / 2 && (pointNum / nodes) < 0.75) {
                xy[0] = parseFloat(xy[0]) - (1.2 * formatFontSize)
                xy[1] = parseFloat(xy[1]) + (1.6 * formatFontSize)
            } else if (pointNum / nodes == 0.75) {
                xy[0] = parseFloat(xy[0]) - (1.2 * formatFontSize)
                xy[1] = parseFloat(xy[1]) + (0.5 * formatFontSize)
            } else if ((pointNum / nodes) > 0.75) {
                xy[0] = parseFloat(xy[0]) - (1.2 * formatFontSize)
                xy[1] = parseFloat(xy[1]) - (0.8 * formatFontSize)
            }
        } else {
            if (pointNum == 0) {
                xy[1] = parseFloat(xy[1]) - (5.2 * formatFontSize)
            } else if (pointNum / nodes < 0.25) {
                xy[0] = parseFloat(xy[0]) + (1.6 * formatFontSize)
                if (formatFontSize > 10) {
                    xy[1] = parseFloat(xy[1]) - (4 * formatFontSize)
                } else {
                    xy[1] = parseFloat(xy[1]) - (3 * formatFontSize)
                }
            } else if (pointNum / nodes == 0.25) {
                xy[0] = parseFloat(xy[0]) + (1.6 * formatFontSize)
                if (formatFontSize < 10) {
                    xy[1] = parseFloat(xy[1]) - (2 * formatFontSize)
                } else {
                    xy[1] = parseFloat(xy[1]) - (3 * formatFontSize)
                }
            } else if (pointNum < nodes / 2 && (pointNum / nodes) > 0.25) {
                xy[0] = parseFloat(xy[0]) + (1 * formatFontSize)
                if (formatFontSize > 9) {
                    xy[1] = parseFloat(xy[1]) - (2 * formatFontSize)
                } else {
                    xy[1] = parseFloat(xy[1]) - (1 * formatFontSize)
                }
            } else if (pointNum == nodes / 2) {
                if (formatFontSize > 9 && formatFontSize < 17) {
                    xy[1] = parseFloat(xy[1]) - (0.5 * formatFontSize)
                } else if (formatFontSize > 17) {
                    xy[1] = parseFloat(xy[1]) - (0.6 * formatFontSize)
                }
                else {
                    xy[1] = parseFloat(xy[1]) + (0.8 * formatFontSize)
                }
            } else if (pointNum > nodes / 2 && (pointNum / nodes) < 0.75) {
                xy[0] = parseFloat(xy[0]) - (1 * formatFontSize)
                if (formatFontSize > 9) {
                    xy[1] = parseFloat(xy[1]) - (2 * formatFontSize)
                } else {
                    xy[1] = parseFloat(xy[1]) - (1 * formatFontSize)
                }
            } else if (pointNum / nodes == 0.75) {
                xy[0] = parseFloat(xy[0]) - (1.6 * formatFontSize)
                if (formatFontSize < 10) {
                    xy[1] = parseFloat(xy[1]) - (2 * formatFontSize)
                } else {
                    xy[1] = parseFloat(xy[1]) - (3 * formatFontSize)
                }
            } else if ((pointNum / nodes) > 0.75) {
                xy[0] = parseFloat(xy[0]) - (1.6 * formatFontSize)
                if (formatFontSize > 10) {
                    xy[1] = parseFloat(xy[1]) - (4 * formatFontSize)
                } else {
                    xy[1] = parseFloat(xy[1]) - (3 * formatFontSize)
                }
            }
        }
        let drawtext = drawArea.text(text).attr({
            fill: color,
            x: xy[0],
            y: xy[1],
        })
        drawtext.font({
            family: 'Helvetica',
            size: this.panel.cssFontSize,
            weight: fontWeight,
            anchor: align
        })
    }

    largestVaule(arr) {
        return arr.map(Function.apply.bind(Math.max, null))
    }

    setPolygonPosition(radius, pointNum, nodesNum, indexValue, maxValue, xy) {
        let angle = 360 / nodesNum
        let degree = -90 + (pointNum * angle)
        let radian = degree / (180 / Math.PI)
        if (this.panel.rangeOfVaule != '' && this.panel.rangeOfVaule != null) {
            maxValue = this.panel.rangeOfVaule
        }
        let x = 0
        let y = 0
        if (indexValue[pointNum] > maxValue) {
            x = (radius * Math.cos(radian)) + xy
            y = (radius * Math.sin(radian)) + xy
        } else {
            x = (radius * Math.cos(radian)) * (indexValue[pointNum] / maxValue) + xy
            y = (radius * Math.sin(radian)) * (indexValue[pointNum] / maxValue) + xy
        }
        return x + ',' + y
    }

    drawPolygon(drawArea, position, color) {
        let polygon = drawArea.polygon(position).attr({
            'fill': color,
            cx: 0,
            cy: 0
        })
    }

    formatLinePosition(drawArea, position, color, centerPoint) {
        position.forEach((item, index) => {
            if (position[index] != null) {
                let x = position[index].split(',')[0]
                let y = position[index].split(',')[1]
                let centerX = centerPoint.split(',')[0]
                let centerY = centerPoint.split(',')[1]
                this.drawLine(drawArea, x, y, color, centerX, centerY)
            }
        })
    }

    drawLine(drawArea, x, y, color, centerX, centerY) {
        let line = drawArea.line(centerX, centerY, x, y)
        line.stroke({ color: color, width: 5 })
    }

    hexToRgbA(hex) {
        let c
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('')
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]]
            }
            c = '0x' + c.join('')
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)'
        }
        throw new Error('Bad Hex')
    }

    componentToHex(c) {
        var hex = c.toString(16)
        return hex.length == 1 ? "0" + hex : hex
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
    }

    drawLegend() {
        Object.keys(this.panel.rowDatas).forEach((key) => {
            if (this.panel.rowDatas[key].editLegendText) {
                this.panel.rowDatas[key].showLegendText = this.panel.rowDatas[key].editLegendText
            } else {
                this.panel.rowDatas[key].showLegendText = this.panel.rowDatas[key].legendText
            }
        })
    }

    changeLegendShow(isShowlegend) {
        if (isShowlegend) {
            this.panel.radarHeight = ""
            this.panel.legendDisplay = ""
        } else {
            this.panel.radarHeight = "height:100%"
            this.panel.legendDisplay = "display:none;"
        }
    }

    chengeLegenColor(isOnChange) {
        this.panel.legendText.forEach((key, index) => {
            this.panel.legendColor[index] = this.panel.rowDatas[key].color
        })
        if (isOnChange) {
            this.drawRadar()
        }
    }

    hoverLinePosition(drawArea, pointPosition, centerPoint, lineNum) {
        let x = pointPosition.split(',')[0]
        let y = pointPosition.split(',')[1]
        let centerX = centerPoint.split(',')[0]
        let centerY = centerPoint.split(',')[1]
        this.drawHoverLine(drawArea, x, y, centerX, centerY, lineNum)
    }

    drawHoverLine(drawArea, x, y, centerX, centerY, lineNum) {
        let line = drawArea.line(centerX, centerY, x, y)
        let toolTipId = this.panel.radarToolTipId
        let rowdatas = this.panel.rowDatas
        let legendText = this.panel.legendText
        let nodes = this.panel.tagsNum
        line.attr('lineNum', lineNum)
        line.attr('highlight', this.panel.isHighlight)
        line.stroke({ color: 'rgba(255,255,255,0)', width: 25 })

        $('#' + line.attr('id'))
            .mouseenter(function (ev) {
                if (line.attr('highlight')) {
                    document.getElementById(toolTipId).innerHTML = ''
                    if (lineNum !== null && lineNum !== '') {
                        if (lineNum == 0) {
                            document.getElementById(toolTipId).style.top = '18%'
                            document.getElementById(toolTipId).style.left = '42%'
                        } else if (lineNum / nodes < 0.25 && lineNum != 0) {
                            document.getElementById(toolTipId).style.top = '20%'
                            document.getElementById(toolTipId).style.left = '50%'
                        } else if (lineNum / nodes == 0.25) {
                            document.getElementById(toolTipId).style.top = '30%'
                            document.getElementById(toolTipId).style.left = '52%'
                        } else if (lineNum / nodes > 0.25 && lineNum / nodes < 0.5) {
                            document.getElementById(toolTipId).style.top = '40%'
                            document.getElementById(toolTipId).style.left = '50%'
                        } else if (lineNum / nodes == 0.5) {
                            document.getElementById(toolTipId).style.top = '45%'
                            document.getElementById(toolTipId).style.left = '45%'
                        } else if (lineNum / nodes > 0.5 && lineNum / nodes < 0.75) {
                            document.getElementById(toolTipId).style.top = '40%'
                            document.getElementById(toolTipId).style.left = '38%'
                        } else if (lineNum / nodes == 0.75) {
                            document.getElementById(toolTipId).style.top = '30%'
                            document.getElementById(toolTipId).style.left = '36%'
                        } else if (lineNum / nodes > 0.75) {
                            document.getElementById(toolTipId).style.top = '20%'
                            document.getElementById(toolTipId).style.left = '38%'
                        } else {
                            console.log('lineError')
                        }
                        legendText.forEach((item) => {
                            document.getElementById(toolTipId).innerHTML += '<div style="display:block;"><div class="radar-hover-legend-color" style="background-color:' + rowdatas[item].color + ';"></div><span style="min-width:20px;margin:0px 5px">' + rowdatas[item].showLegendText + '</span><span style="min-width:20px;text-align:right;margin:0px 5px;">' + rowdatas[item].showValue[lineNum] + '</span></div>'
                        })
                        document.getElementById(toolTipId).style.display = "block"
                    }
                }
            })
            .mouseleave(function (ev) {
                document.getElementById(toolTipId).style.display = "none"
            })
    }

    hoverEvent(isHover) {
        if (isHover) {
            this.panel.hoverDisplay = 'block'
        } else {
            this.panel.hoverDisplay = 'none'
        }
    }

    setUnitFormat(subItem,isUnit) {//判斷單位與小數點
        let dataList = this.panel.resultData; 
        
        let firstData = dataList[0].datapoints[0]
        let secondData = dataList[1].datapoints[0]
        let exceptedWater = firstData
        let processedWater = secondData
        if(typeof subItem == 'object') {
            this.panel.format = subItem.value;
        }else if (typeof subItem == 'string') {
            this.panel.format = subItem;
        }      
        const formatFnc = kbn.valueFormats[this.panel.format]//依據單位去判斷需要用哪一個公式
        let processedresult 
        let exceptedresult 
        
        if(typeof processedWater == 'object' && typeof exceptedWater == 'object'){//傳入資料型態有可能為object或string
        
            if (!parseInt(this.panel.decimals)) {  
                processedresult = formatFnc(processedWater[0],'',null)
                exceptedresult = formatFnc(exceptedWater[0],'',null)
            } else {
                processedresult = formatFnc(processedWater[0],parseInt(this.panel.decimals),null)
                exceptedresult = formatFnc(exceptedWater[0],parseInt(this.panel.decimals),null)
            }

        }else if(typeof processedWater == 'string' && typeof exceptedWater == 'string'){

            if (!parseInt(this.panel.decimals)) {             
                processedresult = formatFnc(processedWater,'',null)
                exceptedresult = formatFnc(exceptedWater,'',null)
            } else {
                processedresult = formatFnc(processedWater,parseInt(this.panel.decimals),null)
                exceptedresult = formatFnc(exceptedWater,parseInt(this.panel.decimals),null)
            }          
        }
        this.panel.resultData[0].datapoints[1]=(exceptedresult);//指定轉換過單位的結果到datapoint裡面
        this.panel.resultData[1].datapoints[1]=(processedresult);
        this.setFontSize()//render 所有屬性的變化

    }

    setting(isUnit) {  //use datasource unit
        let thisSetting = this.panel;
        thisSetting.isCheckUnit = isUnit;

        var a = this.panel.dataarr[0]['unit'];
        var b = this.panel.dataarr[1]['unit'];
        let dataList = this.panel.resultData; 
        
        let firstData = dataList[0].datapoints[0]
        let secondData = dataList[1].datapoints[0]
        let exceptedWater = firstData
        let processedWater = secondData
        if(isUnit) {
            this.panel.sourceunit[0] = a;
            this.panel.sourceunit[1] = b;
            const formatFnc = kbn.valueFormats['none'];
            let processedresult 
            let exceptedresult 
            
            if(typeof processedWater == 'object' && typeof exceptedWater == 'object'){//傳入資料型態有可能為object或string
            
                if (!parseInt(this.panel.decimals)) {  
                    processedresult = formatFnc(processedWater[0],'',null)
                    exceptedresult = formatFnc(exceptedWater[0],'',null)
                } else {
                    processedresult = formatFnc(processedWater[0],parseInt(this.panel.decimals),null)
                    exceptedresult = formatFnc(exceptedWater[0],parseInt(this.panel.decimals),null)
                }
    
            }else if(typeof processedWater == 'string' && typeof exceptedWater == 'string'){
    
                if (!parseInt(this.panel.decimals)) {             
                    processedresult = formatFnc(processedWater,'',null)
                    exceptedresult = formatFnc(exceptedWater,'',null)
                } else {
                    processedresult = formatFnc(processedWater,parseInt(this.panel.decimals),null)
                    exceptedresult = formatFnc(exceptedWater,parseInt(this.panel.decimals),null)
                }          
            }
            
            this.panel.resultData[0].datapoints[1]=(exceptedresult);//指定轉換過單位的結果到datapoint裡面
            this.panel.resultData[1].datapoints[1]=(processedresult);
            this.setFontSize()//render 所有屬性的變化
        }else{
            this.panel.sourceunit[0] = '';
            this.panel.sourceunit[1] = '';
            if(typeof subItem == 'object') {
                this.panel.format = subItem.value;
            }else if (typeof subItem == 'string') {
                this.panel.format = subItem;
            }      
            const formatFnc = kbn.valueFormats[this.panel.format]//依據單位去判斷需要用哪一個公式
            let processedresult 
            let exceptedresult 
            
            if(typeof processedWater == 'object' && typeof exceptedWater == 'object'){//傳入資料型態有可能為object或string
            
                if (!parseInt(this.panel.decimals)) {  
                    processedresult = formatFnc(processedWater[0],'',null)
                    exceptedresult = formatFnc(exceptedWater[0],'',null)
                } else {
                    processedresult = formatFnc(processedWater[0],parseInt(this.panel.decimals),null)
                    exceptedresult = formatFnc(exceptedWater[0],parseInt(this.panel.decimals),null)
                }
    
            }else if(typeof processedWater == 'string' && typeof exceptedWater == 'string'){
    
                if (!parseInt(this.panel.decimals)) {             
                    processedresult = formatFnc(processedWater,'',null)
                    exceptedresult = formatFnc(exceptedWater,'',null)
                } else {
                    processedresult = formatFnc(processedWater,parseInt(this.panel.decimals),null)
                    exceptedresult = formatFnc(exceptedWater,parseInt(this.panel.decimals),null)
                }          
            }
           
            this.panel.resultData[0].datapoints[1]=(exceptedresult);//指定轉換過單位的結果到datapoint裡面
            this.panel.resultData[1].datapoints[1]=(processedresult);
            this.setFontSize()//render 所有屬性的變化
        }  
    }
}

WaterRate.templateUrl = 'partials/module.html';
