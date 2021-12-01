import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function part1(data: string[]): number {
    return 0;
}

function part2(data: string[]): number {
    return 0;
}

try {
    readFileToArray('./1/input.txt').then((data) => {
        const testData = [

        ];

        // strictEqual(test(12), 2);

        console.log('Part 1', part1(data));

        // strictEqual(test(14), 2);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
