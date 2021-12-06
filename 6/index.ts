import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Sea {
    private fishes: number[];

    constructor(fishAges: string) {
        this.fishes = fishAges.split(',').map(Number);
    }

    getCountAfterDays(days: number) {
        for (let i = 1; i <= days; i += 1) {
            const newFish: number[] = [];
            const state = [...this.fishes];

            state.forEach((age, index) => {
                if (age === 0) {
                    newFish.push(8);
                    state[index] = 7;
                }

                state[index] -= 1;
            });


            this.fishes = [
                ...state,
                ...newFish,
            ]
        }

        return this.fishes.length;
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
