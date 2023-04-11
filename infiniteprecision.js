Number.prototype.mod = function (n) {
    "use strict";
    return ((this % n) + n) % n;
};

class BigDecimal {
    constructor(number) {
        this.number = number;
        var sepNum = number.split('.');

        this.negative = number.includes('-');
        if (this.negative) {
            sepNum[0] = sepNum[0].replace(/-/g,'');
        }

        // this splits the number into blocks of 10 decimals
        this.int = sepNum[0].split(/(?=(?:..........)*$)/);
        if (this.int[0].length < 10) {
            this.int[0] = '0'.repeat(10-this.int[0].length) + this.int[0];
        }

        if (sepNum.length != 1) {
            this.float = sepNum[1].match(/.{1,10}/g);
            if (this.float[(this.float).length-1].length < 10) {
                this.float[(this.float).length-1] = this.float[(this.float).length-1] + '0'.repeat(10-this.float[(this.float).length-1].length);
            }
        }
        else {
            this.float = '0'.repeat(10);
        }
        // console.log(this.int, this.float);
    }

    bigger(big1,big2) { // big 1 > big2?
        if (big1.int.length > big2.int.length) {
            return true;
        }
        else if (big1.int.length < big2.int.length) {
            return false;
        }
        else {
            // big brain comparison here.
        }
    }

    add(big1,big2) {
        // equalize float lengths.
        if (big1.float.length > big2.float.length) {
            for (let i=0; i<(big2.float.length-big1.float.length); i++) {big2.float.push('0'.repeat(10))}
        }
        else if (big1.float.length < big2.float.length) {
            for (let i=0; i<(big1.float.length-big2.float.length); i++) {big1.float.push('0'.repeat(10))}
        }

        // equalize int lengths.
        if (big1.int.length > big2.int.length) {
            for (let i=0; i<(big2.int.length-big1.int.length); i++) {big2.int.unshift('0'.repeat(10))}
        }
        else if (big1.float.length < big2.float.length) {
            for (let i=0; i<(big1.int.length-big2.int.length); i++) {big1.int.unshift('0'.repeat(10))}
        }

        // iterate backwards from float side.
        var resultFloat = '';
        var resultInt = '';

        var tempSum = 0;
        var carryOver = 0;

        var digit1 = 0;
        var digit2 = 0;

        for (let i=10*Math.max(big1.float.length,big2.float.length)-1;i>=0;i--) {
            try {digit1 = Number(big1.float[Math.floor(i/10)][i%10]);}
            catch {digit1 = 0;}
            try {digit2 = Number(big2.float[Math.floor(i/10)][i%10]);}
            catch {digit2 = 0;}
            tempSum = digit1 + digit2;
            resultFloat = resultFloat + (tempSum % 10 + carryOver).toString();
            carryOver = Math.floor(tempSum/10);
        }

        for (let i=0;i<=10*Math.max(big1.int.length,big2.int.length)-1;i++) {
            try {digit1 = Number(big1.int[big1.int.length - Math.floor(i/10)-1][9-i%10]);}
            catch {digit1 = 0;}
            try {digit2 = Number(big2.int[big2.int.length - Math.floor(i/10)-1][9-i%10]);}
            catch {digit2 = 0;}
            tempSum = digit1 + digit2;
            resultInt = resultInt + (tempSum % 10 + carryOver).toString();
            carryOver = Math.floor(tempSum/10);
        }

        resultInt = resultInt + carryOver;

        // console.log(resultInt + '.' + resultFloat);

        return new BigDecimal(resultInt.split("").reverse().join("") + '.' + resultFloat.split("").reverse().join(""));
    }

    subtract(big1,big2) { // b1-b2
        // equalize float lengths.
        if (big1.float.length > big2.float.length) {
            for (let i=0; i<(big2.float.length-big1.float.length); i++) {big2.float.push('0'.repeat(10))}
        }
        else if (big1.float.length < big2.float.length) {
            for (let i=0; i<(big1.float.length-big2.float.length); i++) {big1.float.push('0'.repeat(10))}
        }

        // equalize int lengths.
        if (big1.int.length > big2.int.length) {
            for (let i=0; i<(big2.int.length-big1.int.length); i++) {big2.int.unshift('0'.repeat(10))}
        }
        else if (big1.float.length < big2.float.length) {
            for (let i=0; i<(big1.int.length-big2.int.length); i++) {big1.int.unshift('0'.repeat(10))}
        }

        // iterate backwards from float side.
        var resultFloat = '';
        var resultInt = '';

        var tempSum = 0;
        var carryOver = 0;

        var digit1 = 0;
        var digit2 = 0;

        for (let i=10*Math.max(big1.float.length,big2.float.length)-1;i>=0;i--) {
            try {digit1 = Number(big1.float[Math.floor(i/10)][i%10]);}
            catch {digit1 = 0;}
            try {digit2 = Number(big2.float[Math.floor(i/10)][i%10]);}
            catch {digit2 = 0;}
            tempSum = digit1 - digit2;
            resultFloat = resultFloat + ((tempSum.mod(10) - carryOver).mod(10)).toString();
            carryOver = Math.floor(tempSum/10) + ((tempSum.mod(10) - carryOver < 0) ? 1 : 0);
        }

        for (let i=0;i<=10*Math.max(big1.int.length,big2.int.length)-1;i++) {
            try {digit1 = Number(big1.int[big1.int.length - Math.floor(i/10)-1][9-i%10]);}
            catch {digit1 = 0;}
            try {digit2 = Number(big2.int[big2.int.length - Math.floor(i/10)-1][9-i%10]);}
            catch {digit2 = 0;}
            tempSum = digit1 - digit2;
            resultInt = resultInt + ((tempSum.mod(10) - carryOver).mod(10)).toString();
            carryOver = Math.floor(tempSum/10) + ((tempSum.mod(10) - carryOver < 0) ? 1 : 0);
        }

        resultInt = resultInt + carryOver;

        // console.log(resultInt + '.' + resultFloat);

        return new BigDecimal(resultInt.split("").reverse().join("") + '.' + resultFloat.split("").reverse().join(""));
    }
}