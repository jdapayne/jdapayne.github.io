export function randBetween(n,m) {
    // return a random integer between n and m inclusive
    return n+Math.floor(Math.random()*(m-n+1));
}

export function roundToTen (n) {
    return Math.round(n/10)*10;
}
