const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const answerLength = 4;
let gameTimes = 10;

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let answer = "";

for (let i = 0; i < answerLength; ++i) {
    const randIndex = Math.floor(Math.random() * (10 - i));
    answer += arr.splice(randIndex, 1)[0];
}

console.log(`答案是:(${answer})`);

rl.on("line", (input) => {
    if (new Set(input).size !== answerLength) {
        console.log("輸入長度錯誤或數字重複");
        return;
    } else if (Array.from(input, Number).includes(NaN)) {
        console.log("包含非法字元");
        return;
    }

    let a = 0;
    let b = 0;
    gameTimes--;

    for (let i = 0; i < answerLength; ++i) {
        const compareIndex = answer.indexOf(input[i]);
        console.log(answer[i], input[i], compareIndex);
        if (compareIndex >= 0) {
            if (compareIndex == i) {
                ++a;
            } else {
                ++b;
            }
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

rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
});
