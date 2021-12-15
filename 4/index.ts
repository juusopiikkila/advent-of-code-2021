import { strictEqual } from 'assert';
import { chunk } from 'lodash';
import { readFileToArray } from '../utils';

class Board {
    data: number[][] = [];

    hits: number[][] = [];

    constructor(data: string[]) {
        data.forEach((line) => {
            const matches = line.trim().replace(/[\s]+/g, ' ').split(' ');

            this.data.push(matches.map(Number));
            this.hits.push(new Array(matches.length).fill(0));
        });
    }

    play(number: number) {
        this.data.forEach((line, rowIndex) => {
            const numIndex = line.indexOf(number);

            if (numIndex !== -1) {
                this.hits[rowIndex][numIndex] = 1;
            }
        });
    }

    hasBingo() {
        const cols = this.hits[0].map((nums, index) => this.hits.reduce((acc, row) => [...acc, row[index]], []));

        for (let i = 0; i < cols.length; i += 1) {
            if (cols[i].reduce((acc, num) => acc + num, 0) === cols[i].length) {
                return true;
            }
        }

        for (let i = 0; i < this.hits.length; i += 1) {
            if (this.hits[i].reduce((acc, num) => acc + num, 0) === this.hits[i].length) {
                return true;
            }
        }

        return false;
    }

    getScore() {
        const hits = this.hits.reduce((acc, row) => [...acc, ...row], []);
        const data = this.data.reduce((acc, row) => [...acc, ...row], [])
            .filter((number, index) => !hits[index]);

        return data.reduce((acc, num) => acc + num, 0);
    }
}

class Bingo {
    boards: Board[] = [];

    numbers: number[];

    constructor(data: string[]) {
        this.numbers = data[0].split(',').map(Number);
        this.boards = chunk(data.slice(2), 6).map((c) => new Board(c.slice(0, 5)));
    }

    play(fromLast: boolean): [Board, number] {
        const winningBoards: [Board, number][] = [];

        for (let i = 0; i < this.numbers.length; i += 1) {
            for (let j = 0; j < this.boards.length; j += 1) {
                if (this.boards[j].hasBingo()) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                this.boards[j].play(this.numbers[i]);

                if (this.boards[j].hasBingo()) {
                    winningBoards.push([
                        this.boards[j],
                        this.numbers[i],
                    ]);
                }
            }
        }

        return fromLast ? winningBoards[winningBoards.length - 1] : winningBoards[0];
    }

    getFinalScore(fromLast = false) {
        const [winningBoard, number] = this.play(fromLast);

        return winningBoard.getScore() * number;
    }
}

function part1(data: string[]): number {
    return (new Bingo(data)).getFinalScore();
}

function part2(data: string[]): number {
    return (new Bingo(data)).getFinalScore(true);
}

try {
    readFileToArray('./4/input.txt').then((data) => {
        const testData = [
            '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1',
            '',
            '22 13 17 11  0',
            ' 8  2 23  4 24',
            '21  9 14 16  7',
            ' 6 10  3 18  5',
            ' 1 12 20 15 19',
            '',
            ' 3 15  0  2 22',
            ' 9 18 13 17  5',
            '19  8  7 25 23',
            '20 11 10 24  4',
            '14 21 16 12  6',
            '',
            '14 21 17 24  4',
            '10 16 15  9 19',
            '18  8 23 26 20',
            '22 11 13  6  5',
            ' 2  0 12  3  7',
        ];

        strictEqual((new Bingo(testData)).getFinalScore(), 4512);

        console.log('Part 1', part1(data));

        strictEqual((new Bingo(testData)).getFinalScore(true), 1924);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
