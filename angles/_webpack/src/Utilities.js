export function randBetween(n,m) {
    // return a random integer between n and m inclusive
    return n+Math.floor(Math.random()*(m-n+1));
}

export function randMultBetween(min,max,n) {
    //return a random multiple of n between n and m (inclusive if possible)
    min = Math.ceil(min/n)*n;
    max = Math.floor(max/n)*n; // could check divisibility first to maximise performace, but I'm sure the hit isn't bad
    
    return randBetween(min/n,max/n)*n
}

export function roundToTen (n) {
    return Math.round(n/10)*10;
}

export function roundDP (x,n) {
    return Math.round(x*10**n)/(10**n);
}
