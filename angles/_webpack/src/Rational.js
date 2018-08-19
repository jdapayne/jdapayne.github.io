/* Some notes:
 * this is very un-checked and type-unsafe - if you pass in something other than an integre or a rational, it may muck up
 */

//export default class Rational {
class Rational {
    constructor(a, b) {
        if(!b) b = 1; //works for integers as well

        this.s = (a*b>0)?1:-1;
        this.n = Math.abs(a);
        this.d = Math.abs(b);

        this._reduce();
    }

    _reduce() {
        let gcd = Rational.gcd(this.n,this.d);
        this.n = this.n/gcd;
        this.d = this.d/gcd;
    }

    times(a,b) {
        let that;
        if (a instanceof Rational) that = a;
        else if (b) that = new Rational(a,b);
        else that = new Rational(a);

        return new Rational(this.n*that.n*this.s*that.s,this.d*that.d);
    }

    add(a,b) {
        let that;
        if (a instanceof Rational) that = a;
        else if (b) that = new Rational(a,b);
        else that = new Rational(a);

        const d = this.d*that.d;
        const n = this.s*this.n*that.d + that.s*that.n*this.d;

        return new Rational(n,d);
    }

    equals(a,b) {
        let that;
        if (a instanceof Rational) that = a;
        else if (b) that = new Rational(a,b);
        else that = new Rational(a);

        return (this.n === that.n && this.d === that.d && this.s === that.s);
    }

    toString(improper) {
        const sign = this.s<0 ? "-" : "";
        
        if (this.n === 0) return "0";

        if (improper) {
            return sign + this.n.toString() + "/" + this.d.toString();
        }
        else {
            let whole, wholeS, fraction, fractionS, space=" ";

            whole = Math.floor(this.n/this.d);
            if (whole === 0) {
                wholeS = "";
                space = "";
            }
            else wholeS = whole.toString();

            fraction = this.n % this.d;
            if (fraction === 0) {
                fractionS = "";
                space = "";
            }
            else fractionS = (this.n % this.d).toString() + "/" + this.d.toString();

            return sign + wholeS + space + fractionS;
        }
    }

    static gcd(n,m) {
        //Euclidean algorithm
        let d = Math.max(n,m), r = Math.min(n,m);
        while (r>0) {
            let newr = d%r;
            let newd = r;
            r = newr;
            d = newd
        }
        return d;
    }
}

/* Tests */

let a = new Rational(1,3).add(1,6);

console.log(a.equals(new Rational(1,4).times(2)));
