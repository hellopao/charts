import StockChart from "./base";

interface KLineOptions extends StockChart.BaseOptions {
    dataSet: {
        ohlcPrices: { o: number; h: number; l: number; c: number; }[];
        maPrices?: {
            ma5?: number[];
            ma10?: number[];
            ma20?: number[];
            ma30?: number[];
        },
        maColors?: {
            ma5?: string;
            ma10?: string;
            ma20?: string;
            ma30?: string;
        },
        volumes: number[];
    },
    legend?: {
        x: number;
        y: number
    };
}

export class KLine extends StockChart.Base<KLineOptions> {

    static CANDLE_STICK_WIDTH = 4;
    static MA_COLORS = {
        ma5: 'rgb(254,227,55)',
        ma10: 'rgb(68,200,171)',
        ma20: 'rgb(146,79,216)',
        ma30: 'rgb(45, 111, 177)',
    };

    constructor(public options: KLineOptions) {
        super(options);

        this.draw();
    }

    draw() {
        this.drawPriceGrid();        
        this.drawVolumeGrid();

        this.drawPriceLines();
        this.drawVolumeLines();

        this.drawPriceText();
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
        const {priceGrid} = this.options;
        const {ohlcPrices} = this.options.dataSet;
        const {candleStickWidth = KLine.CANDLE_STICK_WIDTH} = this.options.global;

        const { highest, lowest } = this.getEndsPrice();

        // 蜡烛图
        for (let i = 0, len = ohlcPrices.length; i < len; i++) {
            const price = ohlcPrices[i];
            let x = this.getOffsetX(i, len, priceGrid.width, candleStickWidth, priceGrid.origin.x);

            // 开盘、收盘
            this.chart.drawLine({
                points: [{
                    x, y: this.getOffsetY(price.o, highest, lowest, priceGrid.height, priceGrid.origin.y)
                }, {
                    x, y: this.getOffsetY(price.c, highest, lowest, priceGrid.height, priceGrid.origin.y)
                }],
                width: candleStickWidth,
                color: this.getLineColor(price.c, price.o)
            })

            // 最高、最低
            this.chart.drawLine({
                points: [{
                    x, y: this.getOffsetY(price.h, highest, lowest, priceGrid.height, priceGrid.origin.y)
                }, {
                    x, y: this.getOffsetY(price.l, highest, lowest, priceGrid.height, priceGrid.origin.y)
                }],
                color: this.getLineColor(price.c, price.o),
                width: 1
            });
        }

        this.drawMALines();
        this.drawMALengend();
    }

    drawPriceText() {
        this.drawAxisXText();
        this.drawAxisYText();
    }

    getEndsPrice() {
        const { ohlcPrices , maPrices} = this.options.dataSet;

        const hPrices = ohlcPrices.map(price => price.h);
        const lPrices = ohlcPrices.map(price => price.l);

        let highest = Math.max(...hPrices);
        let lowest = Math.min(...lPrices);

        Object.keys(maPrices).forEach(item => {
            highest = Math.max(highest, ...maPrices[item]);
            lowest = Math.min(lowest, ...maPrices[item]);
        })

        return {
            highest, lowest
        }
    }

    drawMALines() {
        const { maPrices = {}, maColors = KLine.MA_COLORS } = this.options.dataSet;
        const {priceGrid} = this.options;

        const { highest, lowest } = this.getEndsPrice();

        Object.keys(maPrices).forEach(item => {
            const prices = maPrices[item];
            const color = maColors[item];

            this.chart.drawLine({
                points: prices.map((price, index) => {
                    return {
                        x: this.getOffsetX(index, prices.length, priceGrid.width, 1, priceGrid.origin.x),
                        y: this.getOffsetY(price, highest, lowest, priceGrid.height, priceGrid.origin.y)
                    }
                }),
                color,
            })
        })
    }

    drawMALengend() {
        const { textColor = KLine.TEXT_COLOR} = this.options.global;
        const {priceGrid} = this.options;
        const {maPrices = {}, maColors = KLine.MA_COLORS,} = this.options.dataSet;

        const {legend = {x: 0, y: 0}} = this.options;

        const radius = 4;

        const keys = Object.keys(maPrices);

        const deltaX = priceGrid.width / keys.length;

        keys.forEach((item, index) => {
            const prices = maPrices[item];
            // 圆
            this.chart.drawDot({
                radius,
                color: maColors[item]
            }, {
                x: index * deltaX + legend.x + radius, y: legend.y + 15 - radius 
            })

            // 文字
            this.chart.drawText({
                content: `${item.toUpperCase()} ${prices[prices.length - 1]}`,
                color: textColor,
            }, {
                x: index * deltaX + legend.x + radius + 10, y: legend.y + 15 
            })
        })
    }

    drawAxisYText() {
        const {textColor = KLine.TEXT_COLOR} = this.options.global;
        const {priceGrid, volumeGrid, priceTextOffsetX = KLine.AXIS_X} = this.options;
        const {ohlcPrices , volumes} = this.options.dataSet;
        const { highest, lowest } = this.getEndsPrice();
        const row = priceGrid.row || 4;

        for (var i = 0; i <= row; i++) {
            const price = highest - (highest - lowest) * i / row;

            this.chart.drawText({
                content: price.toFixed(2),
                baseline: i === 0 ? "top" : (i === row ? "bottom": "middle"),
                color: textColor
            }, {
                x: priceTextOffsetX, 
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

    }

    drawVolumeLines() {
        const {volumes, ohlcPrices} = this.options.dataSet;
        const {volumeGrid} = this.options;
        const {candleStickWidth = KLine.CANDLE_STICK_WIDTH} = this.options.global;

        const maxVolume = Math.max(...volumes);
        const volumeCount = volumes.length;

        volumes.forEach((volume, index) => {
            const x = this.getOffsetX(index, volumeCount, volumeGrid.width, 1, volumeGrid.origin.x);
            const price = ohlcPrices[index];
            this.chart.drawLine({
                points: [{
                    x, y: this.getOffsetY(volume, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                }, {
                    x, y: this.getOffsetY(0, maxVolume, 0, volumeGrid.height, volumeGrid.origin.y)
                }],
                width: candleStickWidth,
                color: this.getLineColor(price.c, price.o)
            })
        })
    }
}