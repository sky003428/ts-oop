const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const maxNumber: number = 100;
const answer: number = Math.ceil(Math.random() * maxNumber);
let rangeMin: number = 1;
let rangeMax: number = maxNumber;

console.log(`答案是:(${answer})`);

rl.on("line", (input: string) => {
    const inputNumber = +input;
    if (isNaN(inputNumber) || !Number.isInteger(inputNumber)) {
        console.log("輸入非整數");
        return;
    } else if (inputNumber < rangeMin || inputNumber > rangeMax) {
        console.log("數字不在範圍內");
        return;
    }

    if (inputNumber === answer) {
        console.log("答對了!!");
        rl.close();
    } else if (answer > inputNumber) {
        console.log(`${inputNumber + 1} ~ ${rangeMax}`);
        rangeMin = inputNumber + 1;
    } else {
        console.log(`從${rangeMin} ~ ${inputNumber - 1}`);
        rangeMax = inputNumber - 1;
    }
});

rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
});
