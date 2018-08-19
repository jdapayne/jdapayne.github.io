import {randBetween} from './Utilities';

export default class Aosl {
    constructor(angles, missing) {
        // angles :: [int]
        // missing :: [boolean]

        if (angles === []) {throw new Error("argument must not be empty")};
        if (Math.round(angles.reduce((x,y) => x+y)) !== 180) {throw new Error("Angle sum must be 180")};

        this.angles = angles;
        this.missing = missing
    }

    static random(n,minangle) {
        if (n < 2) return null;
        if (minangle === undefined) minangle = 10;

        let angles = [];
        let left = 180;
        for (let i=0; i<n-1; i++) {
            let maxangle = left - minangle*(n-i-1);
            let nextangle = randBetween(minangle,maxangle);
            left -= nextangle;
            angles.push(nextangle);
        }
        angles[n-1] = left;

        let missing = [];
        missing.fill(false,0,n-1);
        missing[randBetween(0,n-1)] = true;

        return new Aosl(angles,missing);
    }

    static randomrep(n,m,minangle) {
        // n: number of angle
        // m: number of repeated angles (must be <= n)
        if (n < 2) return null;
        if (m < 1) return null;
        if (m > n) return null;
        if (minangle === undefined) minangle = 10;

        // All missing - do as a separate case
        if (n === m) {
            let angles = [];
            angles.length = n;
            angles.fill(180/n);
            let missing = [];
            missing.length = n;
            missing.fill(true);

            return new Aosl(angles,missing);
        }

        let angles = [];
        let missing = [];
        missing.length = n;
        missing.fill(false);

        // choose a value for the missing angles
        const maxrepangle = (180-minangle*(n-m))/m;
        const repangle = randBetween(minangle,maxrepangle);

        // choose values for the other angles
        let otherangles = [];
        let left = 180 - repangle*m;
        for (let i=0; i<n-m-1; i++) {
            let maxangle = left - minangle*(n-m-i-1);
            let nextangle = randBetween(minangle,maxangle);
            left -= nextangle;
            otherangles.push(nextangle);
        }
        otherangles[n-m-1] = left;

        // choose where the missing angles are
        {
        let i=0;
        while (i<m) {
            let j = randBetween(0,n-1);
            if (missing[j] === false) {
                missing[j] = true;
                angles[j] = repangle;
                i++
            }
        }
        }

        // fill in the other angles
        {
        let j=0;
        for (let i=0;i<n;i++) {
            if (missing[i] === false) {
                angles[i] = otherangles[j];
                j++
            }
        }
        }
        return new Aosl(angles,missing);
    }
    
    static testAosl(n) {
        switch (n) {
            case 0: return new Aosl([20,60,100],[false,true,false]);
            case 1: return new Aosl([40,100,40],[1,0,1]);
        }
    }
}
