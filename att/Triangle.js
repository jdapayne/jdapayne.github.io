function Triangle(base, side1, side2, height) {
    // Won't acually use the constructor.
    // Instead, use `$.extend(new Triangle(), obj)`, where `obj` has the right attributes
    this.base = base;
    this.side1 = side1;
    this.side2 = side2;
    this.height = height

    this.area = function () {
        return this.base * this.height / 2;
    }

    this.isRightAngled = function () {
        return (this.height === this.side1 || this.height === this.side2)
    }

    this.isIsosceles = function () {
        return (this.side1 === this.side2)
    }
}


