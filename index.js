const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let gameTimes = 10;
let answerLength = 4;

const answerArr = new Array(answerLength);
for (let i = 0; i < answerArr.length; i++) {
    answerArr[i] = parseInt(Math.random() * 10);
}
const answer = answerArr.join("")
console.log(`答案是:(${answer})`);

rl.on("line", (input) => {
    if (input.length != answerLength || Array.from(input, Number).includes(NaN)) {
        console.log("格式錯誤");
        return
    }

    let a = 0;
    let b = 0;
    const compareArr = [...answerArr];
    const numArr = Array.from(input, Number);
    gameTimes--;


    for (let i = 0; i < answerLength; i++) {
        if (numArr[i] === compareArr[i]) {
            a++;
            compareArr[i] = -1;
            numArr[i] = -2;
        }
    }

    for (let i = 0; i < answerLength; i++) {
        const compareIndex = compareArr.indexOf(numArr[i]);
        if (compareIndex >= 0) {
            b++;
            compareArr[compareIndex] = -3;
        }
    }

    if (input === answer) {
        console.log("答對了!!");
        rl.close();
    } else {
        console.log(`答錯了:${a}A${b}B`);
        if (gameTimes < 1) {
            console.log(`公布答案:${answer}`);
            rl.close();
        }
    }

});

rl.on('close', () => {
    console.log("Goodbye!");
    process.exit(0);
});