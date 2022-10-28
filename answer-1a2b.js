"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export default answer;
function default_1() {
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let answer = "";
    for (let i = 0; i < 4; ++i) {
        const randIndex = Math.floor(Math.random() * (10 - i));
        answer += pool.splice(randIndex, 1)[0];
    }
    return answer;
}
exports.default = default_1;
