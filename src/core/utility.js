CanvasRenderingContext2D.prototype.circle = function(x, y, r, fillStyle) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI, false);
    if (fillStyle) {
        this.fillStyle = fillStyle;
    }
    this.fill();
};

CanvasRenderingContext2D.prototype.drawLine = function(x, y, length, radians, strokeStyle, lineWidth) {
    var x2 = x + length * Math.cos(radians);
    var y2 = y + length * Math.sin(radians);
    this.beginPath();
    this.moveTo(x, y);
    this.lineTo(x2, y2);
    if (strokeStyle) {
        this.strokeStyle = strokeStyle;
    }
    if (lineWidth) {
        this.lineWidth = lineWidth;
    }
    this.stroke();
};