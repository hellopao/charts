import {Canvas} from "../../core/canvas";

module StockChart {
    
    interface Grid {
        origin: {x: number; y: number;};
        width: number;
        height: number;
        row?: number;
        column?: number;
    }

    export interface BaseOptions {
        width?: number;
        height?: number;
        styles?: {
            [key: string]: string;
        };
        container: string | HTMLElement | Element;
        global?: {
            textColor?: string;
            riseColor?: string;
            fallColor?: string;
            flatColor?: string;
            gridLineColor?: string;
            gridLineWidth?: number;
            priceLineColor?: string;
            avgPriceLineColor?: string;
            volumeColor?: string;
            candleStickWidth?: number;
        },
        priceGrid: Grid;
        volumeGrid: Grid;
        priceTextOffsetX?: number;
    }

    export abstract class Base<T extends BaseOptions> {
        static RISE_COLOR = "red";
        static FALL_COLOR = "green";
        static FLAT_COLOR = "black";
        static GRID_LINE_COLOR = "#dddddd";
        static VOLUME_COLOR = "#2f84cc";
        static GRID_LINE_WIDTH = 1;
        static TEXT_COLOR = "#888888";
        static AXIS_X = 0;

        chart: Canvas;

        constructor(public options: T) {
            const {width, height, container, styles} = options;

            this.options.global = this.options.global || {};
            this.chart = new Canvas({
                width, height, container, styles
            });
        }

        drawGrid(grid: Grid) {
            const {gridLineWidth = Base.GRID_LINE_WIDTH, gridLineColor = Base.GRID_LINE_COLOR} = this.options.global;
            const {width, height, origin, column = 2, row = 2} = grid;

            this.chart.drawGrid({
                origin, width, height, column, row,
                lineColor: gridLineColor,
                lineWidth: gridLineWidth,
            });
        }

        getLineColor(price: number, base: number) {
            const {riseColor = Base.RISE_COLOR, fallColor = Base.FALL_COLOR, flatColor = Base.FLAT_COLOR} = this.options.global;
            if (+price - base == 0) return flatColor;
            return +price > +base ? riseColor : fallColor;
        }

        getOffsetX(index: number, total: number, width: number, lineWidth: number, offset: number) {
            const { gridLineWidth = Base.GRID_LINE_WIDTH} = this.options.global;
            const itemWidth = (width - gridLineWidth * 2 - lineWidth) / (total - 1);
            return offset + itemWidth * index + gridLineWidth + lineWidth * .5;
        }

        getOffsetY(cur: number, highest: number, lowest: number, height: number, offset: number) {
            const { gridLineWidth = Base.GRID_LINE_WIDTH} = this.options.global;
            return offset + (height - gridLineWidth * 2) * (1 - (cur - lowest) / (highest - lowest)) + gridLineWidth;
        }
    }
}

export default StockChart;