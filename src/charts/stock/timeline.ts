import StockChart from "./base";

enum STOCK_TYPE {
    A = 1, HK = 2, US = 3
}

interface TimeLineOptions extends StockChart.BaseOptions {
    dataSet: {
        lastClosePrice: number;
        prices: number[];
        avgPrices: number[];
        volumes: number[];
        times: string[];
    },
    timeInterval?: number;
    tradeHours?: number;
    days?: number;
    volumeTextOffsetX?: number;
    stockType?: 1 | 2 | 3;
}

export class TimeLine extends StockChart.Base<TimeLineOptions> {

    static PRICE_LINE_COLOR = "rgb(92, 157, 214)";
    static AVG_PRICE_LINE_COLOR = "rgb(230, 160, 81)";
    static TIME_INTERVAL = 1;
    static DAYS = 1;
    static STOCK_TYPE = 1;
    static VOLUME_TEXT_OFFSETX = 0;

    timePercent: number;

    constructor(public options: TimeLineOptions) {
        super(options);

        this.timePercent = this.getTimePercent();
        this.draw();
    }

    draw() {
        this.drawPriceGrid();        
        this.drawVolumeGrid();

        this.drawPriceLines();
        this.drawVolumeLines();

        this.drawPriceText();
    }

    getTimePercent() {
        const {timeInterval = TimeLine.TIME_INTERVAL, days = TimeLine.DAYS, stockType = TimeLine.STOCK_TYPE} = this.options;
        const TRADE_HOURS = {
            1: 4,
            2: 5.5,
            3: 5.5
        };
        const {prices} = this.options.dataSet;

        return prices.length / days / (2 + TRADE_HOURS[stockType] * 60 / timeInterval);
    }

    drawPriceText() {
        this.drawAxisXText();
        this.drawAxisYText();
    }

    drawPriceGrid() {
        const {priceGrid} = this.options;
        this.drawGrid(Object.assign({}, priceGrid, {
            row: 4,
            column: 4
        }));
    }

    drawVolumeGrid() {
        const {volumeGrid} = this.options;
        this.drawGrid(Object.assign({}, volumeGrid, {
            row: 2,
            column: 4
        }));
    }

    drawPriceLines() {
        const {priceGrid, dataSet, days = TimeLine.DAYS} = this.options;
        const {priceLineColor = TimeLine.PRICE_LINE_COLOR, avgPriceLineColor = TimeLine.AVG_PRICE_LINE_COLOR} = this.options.global;

        const priceCount = dataSet.prices.length;
        const {highest, lowest} = this.getEndsPrices();

        const timeLinePoints = dataSet.prices.map((price, index) => {
            return {
                x: this.getOffsetX(index, priceCount, priceGrid.width * this.timePercent, 1, priceGrid.origin.x),
                y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
            }
        });

        // 分时线
        this.chart.drawLine({
            points: timeLinePoints,
            color: priceLineColor
        });

        const endY = this.getOffsetY(lowest, highest, lowest, priceGrid.height, priceGrid.origin.y);

        // 分时线下面的填充
        this.chart.drawShape({
            lines: [{
                points: timeLinePoints
            }, {
                points: [{
                    x: timeLinePoints[priceCount - 1].x, y: timeLinePoints[priceCount - 1].y
                }, {
                    x: timeLinePoints[priceCount - 1].x, y: endY
                }]
            }, {
                points: [{
                    x: timeLinePoints[priceCount - 1].x, y: endY
                }, {
                    x: timeLinePoints[0].x, y: endY
                }],
            }], 
            fillStyle: "#d5e6f5"
        })

        // 均价线
        this.chart.drawLine({
            points: dataSet.avgPrices.map((price, index) => {
                return {
                    x: this.getOffsetX(index, priceCount, priceGrid.width * this.timePercent, 1, priceGrid.origin.x),
                    y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                }
            }),
            color: avgPriceLineColor
        });

        // 中价线
        if (days === 1) {
            const center = (highest + lowest) / 2; 

            this.chart.drawDashLine({
                start: {
                    x: priceGrid.origin.x, 
                    y: this.getOffsetY(center, highest, lowest, priceGrid.height, priceGrid.origin.y)
                },
                end: {
                    x: priceGrid.origin.x + priceGrid.width,
                    y: this.getOffsetY(center, highest, lowest, priceGrid.height, priceGrid.origin.y)
                },
                segments: [4, 2],
                color: "#a7d2e9"
            })
        }
    }

    getEndsPrices() {
        const {prices , volumes, lastClosePrice} = this.options.dataSet;
        const {days = TimeLine.DAYS} = this.options;
        let highest = Math.max(...prices);
        let lowest = Math.min(...prices);

        if (days === 1) {
            if (Math.abs(highest - lastClosePrice) > Math.abs(lowest - lastClosePrice)) {
                lowest = lastClosePrice - Math.abs(highest - lastClosePrice);
            } else {
                highest = +lastClosePrice + Math.abs(lastClosePrice - lowest);
            }
        }
        return {highest, lowest}
    }

    drawAxisYText() {
        const {textColor = TimeLine.TEXT_COLOR} = this.options.global;
        const {priceGrid, volumeGrid, priceTextOffsetX = TimeLine.AXIS_X, volumeTextOffsetX = TimeLine.VOLUME_TEXT_OFFSETX} = this.options;
        const {prices , volumes, lastClosePrice} = this.options.dataSet;
        
        const {highest, lowest} = this.getEndsPrices();
        const center = (highest + lowest) / 2; 
        const row = priceGrid.row || 4;

        for (var i = 0; i <= row; i++) {
            const price = highest - (highest - lowest) * i / row;
            const increase = (100 * (price - center) / center).toFixed(2) + "%";

            // 价格
            this.chart.drawText({
                content: price.toFixed(2),
                baseline: i === 0 ? "top" : (i === row ? "bottom": "middle"),
                color: this.getLineColor(price, center)
            }, {
                x: priceTextOffsetX, 
                y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
            })

            // 涨幅
            this.chart.drawText({
                content: increase,
                baseline: i === 0 ? "top" : (i === row ? "bottom": "middle"),
                color: this.getLineColor(price, center)
            }, {
                x: volumeTextOffsetX, 
                y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
            })
        }

        const maxVolume = Math.max(...volumes);    
        this.chart.drawText({
            content: maxVolume.toString(),
            baseline: "top",
            color: textColor
        }, {
            x: priceTextOffsetX, 
            y: volumeGrid.origin.y 
        })
    }

    drawAxisXText() {
        const {priceGrid, days = TimeLine.DAYS} = this.options;

        const times = this.getTimes();

        for (var i = 0, len = times.length; i < len; i++) {
            const deltaX = priceGrid.width / (len - 1);
            this.chart.drawText({
                content: times[i],
                baseline: "top",
                align: i === 0 ? "start" : ((i === len - 1) ? "end": "center"),
            }, {
                x: i * deltaX + priceGrid.origin.x,
                y: priceGrid.origin.y + priceGrid.height
            })
        }
    }

    getTimes() {
        const {times = []} = this.options.dataSet;
        const { days = TimeLine.DAYS, stockType = STOCK_TYPE.A } = this.options;
        if (days === 1) {
            if (stockType === STOCK_TYPE.HK) {
                return ["9:30", "11:00", "12:00/13:00", "14:00", "16:00"];
            } else if (stockType === STOCK_TYPE.A) {
                return ["9:30", "10:30", "11:30/13:00", "14:00", "15:00"]
            } else if (STOCK_TYPE.US) {
                return ["22:30", "00:30", "02:30", "04:30"]
            }
        } else {
            let timeSet = {};
            times.forEach(time => {
                const date = new Date(time);
                const dateStr = `${date.getMonth() + 1}-${date.getDate()}`;

                timeSet[dateStr] = 1;
            })

            return Object.keys(timeSet);
        }

        return times;
    }

    getVolumeColor(volume) {
        const {volumeColor = TimeLine.VOLUME_COLOR} = this.options.global;
        return volumeColor;
    }

    drawVolumeLines() {
        const {volumes, prices, lastClosePrice} = this.options.dataSet;
        const {volumeGrid} = this.options;

        const maxVolume = Math.max(...volumes);
        const volumeCount = volumes.length;

        volumes.forEach((volume, index) => {
            const x = this.getOffsetX(index, volumeCount, volumeGrid.width * this.timePercent, 1, volumeGrid.origin.x);
            const price = prices[index];
            this.chart.drawLine({
                points: [{
                    x, y: this.getOffsetY(volume, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                }, {
                    x, y: this.getOffsetY(0, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                }],
                width: 1,
                color: this.getVolumeColor(volume)
            })
        })
    }
}