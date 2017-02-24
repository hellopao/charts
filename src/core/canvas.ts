
/**
 * Canvas对象参数
 */
interface CanvasOptions {
    /**
     * 画布宽
     */
    width?: number;
    /**
     * 画布高
     */
    height?: number;
    /**
     * 画布父容器元素
     */
    container: HTMLElement | Element | string;
    /**
     * 样式
     */
    styles?: {
        [name: string]: string;
    };
}

/**
 * 点
 */
interface Point {
    /**
     * x轴坐标
     */
    x: number;
    /**
     * y轴坐标
     */
    y: number;
}

/**
 * 线条
 */
type Line = {
    /**
     * 线条颜色
     */
    color?: string;
    /**
     * 线条宽度
     */
    width?: number;
    /**
     * 组成线条的点
     */
    points: Point[];
}

/**
 * 虚线
 */
type DashLine = {
    /**
     * 起始点
     */
    start: Point;
    /**
     * 结束点
     */
    end: Point;
    /**
     * 线条颜色
     */
    color?: string;
    /**
     * 线宽
     */
    width?: number;
    /**
     * 线段和间距（坐标空间单位）长度
     */
    segments: number[];
}

/**
 * 文字
 */
type Text = {
    /**
     * 文字内容
     */
    content: string;
    /**
     * 文字颜色
     */
    color?: string;
    /**
     * 文字大小
     */
    size?: number;
    /**
     * 文字基准线
     */
    baseline?: "top" | "bottom" | "middle" | "Alphabetic" | "hanging";
    /**
     * 文字对齐方式
     */
    align?: "start" | "end" | "left" | "center" | "right";
}

/**
 * 圆点
 */
type Dot = {
    /**
     * 半径
     */
    radius: number;
    /**
     * 圆颜色
     */
    color?: string;
}

/**
 * 圈/圆环
 */
type Circle = {
    /**
     * 半径
     */
    radius: number;
    /**
     * 圆环颜色
     */
    color?: string;
    /**
     * 圆环边框
     */
    border: number;
}
/**
 * 网格
 */
type Grid = {
    /**
     * 原点
     */
    origin: Point;
    /**
     * 网格宽度
     */
    width: number;
    /**
     * 网格高度
     */
    height: number;
    /**
     * 列数
     */
    column: number;
    /**
     * 行数
     */
    row: number;
    /**
     * 网格线宽
     */
    lineWidth?: number;
    /**
     * 网格线颜色
     */
    lineColor?: string;
}

/**
 * 形状
 */
type Shape = {
    /**
     * 构成形状的线条
     */
    lines: Array<{
        points: Point[];
    }>;
    /**
     * 填充样式, 可以是颜色值或者是渐变
     */
    fillStyle: string | CanvasGradient;
}

interface CanvasContext extends CanvasRenderingContext2D {
    setStrokeStyle(strokeStyle): void;
    draw(reserve?: boolean): void;
    setLineWidth(lineWidth: number): void;
    setFillStyle(fillStyle: string | CanvasGradient): void;
    setFontSize(fontSize: number): void;
}

declare var wx: {
    createCanvasContext(canvasId: string): CanvasContext;
}

export class Canvas {

    ctx: CanvasContext;

    private wechat?: boolean;

    constructor(options: CanvasOptions) {
        this.initialize(options);
    }

    private initialize(options: CanvasOptions) {
        const { width = 300, height = 150, styles = {}, container } = options;

        this.wechat = this.isWechatEnv();

        if (!this.wechat) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.style.width = width + "px";
            canvas.height = height;
            canvas.style.height = height + "px";
            Object.keys(styles).forEach(item => {
                if (item === "font") {
                    ctx.font = styles[item];
                } else {
                    canvas.style[item] = styles[item];
                }
            });
            if (typeof container === "string") {
                document.body.querySelector(container).appendChild(canvas);
            } else {
                container.appendChild(canvas);
            }

            this.ctx = ctx as CanvasContext;
        } else {
            this.ctx = wx.createCanvasContext(container as string);
        }
    }

    private isWechatEnv() {
        try {
            return wx !== undefined && typeof wx.createCanvasContext === "function"
        } catch (err) {
            return false;
        }
    }

    /**
     * 实线
     */
    public drawLine(line: Line) {
        const { ctx } = this;

        ctx.save();
        if (this.wechat) {
            line.color && ctx.setStrokeStyle(line.color);
            line.width && ctx.setLineWidth(line.width);
        } else {
            line.color && (ctx.strokeStyle = line.color);
            line.width && (ctx.lineWidth = line.width);
        }

        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);

        for (let i = 1, len = line.points.length; i < len; i++) {
            let point = line.points[i];
            ctx.lineTo(point.x, point.y);
        }

        ctx.stroke();
        this.wechat && ctx.draw(true);
        ctx.restore();
    }

    /**
     * 虚线
     */
    public drawDashLine(line: DashLine) {
        const { ctx } = this;

        ctx.save();

        if (this.wechat) {
            const distanceX = line.end.x - line.start.x;
            const distanceY = line.end.y - line.start.y;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            const repeatTimes = Math.floor(distance / line.segments.reduce((prev, cur) => cur + prev));

            let steps = [];
            for (let i = 0; i < repeatTimes; i++) {
                steps.push(...line.segments);
            }

            let leftSteps = distance - steps.reduce((prev, cur) => cur + prev);
            for (let i = 0; i < line.segments.length; i++) {
                const step = line.segments[i];
                if (leftSteps <= step) {
                    steps.push(leftSteps)
                    break;
                } else {
                    steps.push(step);
                    leftSteps = step - leftSteps;
                }
            }

            ctx.beginPath();
            steps.reduce((prev, step, index) => {
                const offsetX = distanceX * step / distance;
                const offsetY = distanceY * step / distance;
                // 偶数，画线
                if (index % 2 === 1) {
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(prev.x + offsetX, prev.y + offsetY)
                }

                return {
                    x: prev.x + offsetX,
                    y: prev.y + offsetY
                }
            }, line.start);

            line.width && ctx.setLineWidth(line.width);
            line.color && ctx.setStrokeStyle(line.color);
            ctx.stroke();
            ctx.draw(true);
        } else {
            ctx.setLineDash(line.segments);
            ctx.beginPath();
            ctx.moveTo(line.start.x, line.start.y);
            ctx.lineTo(line.end.x, line.end.y);
            line.width && (ctx.lineWidth = line.width);
            line.color && (ctx.strokeStyle = line.color);
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * 文字
     */
    public drawText(text: Text, point: Point) {
        const { ctx } = this;

        ctx.save();

        if (this.wechat) {
            text.color && ctx.setFillStyle(text.color);
            const {baseline, align} = text;
            text.baseline && (ctx.textBaseline = text.baseline);
            text.align && (ctx.textAlign = text.align);
            text.size && ctx.setFontSize(text.size);
        } else {
            text.color && (ctx.fillStyle = text.color);
            text.baseline && (ctx.textBaseline = text.baseline);
            text.align && (ctx.textAlign = text.align);
            if (text.size) {
                ctx.font = ctx.font.replace(/(\d+\.?\d*)(px|rpx|em|rem|pt)/, (str, size, unit) => {
                    return text.size + unit;
                });
            }
        }

        ctx.fillText(text.content, point.x, point.y);
        this.wechat && ctx.draw(true);
        ctx.restore();
    }

    /**
     * 圆
     */
    public drawDot(dot: Dot, point: Point) {
        const { ctx } = this;

        ctx.save();

        ctx.beginPath();
        ctx.arc(point.x, point.y, dot.radius, 0, 2 * Math.PI);

        if (this.wechat) {
            ctx.setFillStyle(dot.color);
        } else {
            ctx.fillStyle = dot.color;
        }
        ctx.fill();

        this.wechat && ctx.draw(true);
        ctx.restore();

    }

    /**
     * 圈/圆环
     */
    public drawCircle(circle: Circle, point: Point) {
        const { ctx } = this;

        ctx.save();

        ctx.beginPath();
        ctx.arc(point.x, point.y, circle.radius, 0, 2 * Math.PI);

        if (this.wechat) {
            ctx.setLineWidth(circle.border);
            ctx.setStrokeStyle(circle.color);
        } else {
            ctx.lineWidth = circle.border;
            ctx.strokeStyle = circle.color;
        }
        ctx.stroke();

        this.wechat && ctx.draw(true);
        ctx.restore();

    }

    /**
     * 网格
     */
    public drawGrid(grid: Grid) {
        const { ctx } = this;
        const { lineWidth = 1 } = grid;

        const deltaX = (grid.width - lineWidth) / grid.column;
        const deltaY = (grid.height - lineWidth) / grid.row;

        //水平线
        for (let i = 0; i <= grid.row; i++) {
            this.drawLine({
                color: grid.lineColor,
                width: grid.lineWidth,
                points: [{
                    x: grid.origin.x,
                    y: grid.origin.y + lineWidth / 2 + deltaY * i
                }, {
                    x: grid.origin.x + grid.width,
                    y: grid.origin.y + lineWidth / 2 + deltaY * i
                }]
            });
        }

        //垂直线
        for (let i = 0; i <= grid.column; i++) {
            this.drawLine({
                color: grid.lineColor,
                width: grid.lineWidth,
                points: [{
                    x: grid.origin.x + lineWidth / 2 + deltaX * i,
                    y: grid.origin.y
                }, {
                    x: grid.origin.x + lineWidth / 2 + deltaX * i,
                    y: grid.origin.y + grid.height
                }]
            });
        }

    }

    /**
     * 形状
     * 由至少两条线构成，第一条线的起点到最后一条线的终点，连成一个形状
     */
    public drawShape(shape: Shape) {
        const { ctx } = this;
        const { lines, fillStyle } = shape;

        if (lines.length < 2) {
            throw new Error("a shape contains at least two lines");
        };

        const origin = lines[0].points[0];
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        for (let line of lines) {
            line.points.forEach((point, index) => {
                ctx.lineTo(point.x, point.y);
            })
        }
        ctx.lineTo(origin.x, origin.y);

        if (this.wechat) {
            ctx.setFillStyle(fillStyle);
        } else {
            ctx.fillStyle = fillStyle;
        }
        ctx.fill();
        this.wechat && ctx.draw(true);

        ctx.restore();
    }
}

