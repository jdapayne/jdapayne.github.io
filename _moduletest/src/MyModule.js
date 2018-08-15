export default function MyModule (x,y) {
    this.x = x;
    this.y = y;
}

MyModule.prototype.sum = function () {
    return this.x + y;
}

MyModule.product = function (a,b) {
    return a*b;
}
