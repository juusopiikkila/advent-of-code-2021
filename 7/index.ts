import { strictEqual } from 'assert';
import { max, min } from 'lodash';
import { readFileToArray } from '../utils';

function getOptimalAlignmentCost(data: string, incrementalCost = false) {
    const crabs = data.split(',').map(Number);
    const costs: number[] = [];
    const maxValue = max(crabs) || 0;
    const minValue = min(crabs) || 0;

    for (let i = minValue; i < maxValue; i += 1) {
        const cost = crabs.reduce((acc, position) => {
            const diff = Math.abs(i - position);

            if (incrementalCost) {
                let positionCost = 0;

                for (let j = 1; j <= diff; j += 1) {
                    positionCost += j;
                }

                return acc + positionCost;
            }

            return acc + diff;
        }, 0);

        costs.push(cost);
    }

    costs.sort((a, b) => a - b);

    return costs[0];
}

function part1(data: string[]): number {
    return getOptimalAlignmentCost(data[0]);
}

function part2(data: string[]): number {
    return getOptimalAlignmentCost(data[0], true);
}

try {
    readFileToArray('./7/input.txt').then((data) => {
        const testData = '16,1,2,0,4,2,7,1,2,14';

        strictEqual(getOptimalAlignmentCost(testData), 37);

        console.log('Part 1', part1(data));

        strictEqual(getOptimalAlignmentCost(testData, true), 168);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
