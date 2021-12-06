import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Sea {
    private fishes: number[];

    constructor(fishAges: string) {
        this.fishes = new Array(9).fill(0);

        fishAges.split(',').map(Number).forEach((age) => {
            this.fishes[age] += 1;
        });
    }

    getCountAfterDays(days: number) {
        for (let i = 1; i <= days; i += 1) {
            const newFishCount = this.fishes.shift() as number;

            this.fishes[8] = newFishCount;
            this.fishes[6] += newFishCount;
        }

        return this.fishes.reduce((acc, school) => acc + school, 0);
    }
}

function part1(data: string[]): number {
    return (new Sea(data[0]).getCountAfterDays(80));
}

function part2(data: string[]): number {
    return (new Sea(data[0]).getCountAfterDays(256));
}

try {
    readFileToArray('./6/input.txt').then((data) => {
        const testData = '3,4,3,1,2';

        strictEqual((new Sea(testData).getCountAfterDays(80)), 5934);

        console.log('Part 1', part1(data));

        strictEqual((new Sea(testData).getCountAfterDays(256)), 26984457539);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
