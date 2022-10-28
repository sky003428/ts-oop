// export default answer;
export default function (): string {
    const pool: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let answer: string = "";

    for (let i = 0; i < 4; ++i) {
        const randIndex: number = Math.floor(Math.random() * (10 - i));
        answer += pool.splice(randIndex, 1)[0];
    }

    return answer;
}
