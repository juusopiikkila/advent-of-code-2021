import { strictEqual } from 'assert';
import { max, min } from 'lodash';
import { readFileToArray } from '../utils';

function getOptimalAlignmentCost(data: string, incrementalCost = false) {
    const crabs = data.split(',').map(Number);
    const costs: Record<string, number> = {};
    const maxValue = max(crabs) || 0;
    const minValue = min(crabs) || 0;

    for (let i = minValue; i < maxValue; i += 1) {
        let cost = 0;

        crabs.forEach((position) => {
            const diff = Math.abs(i - position);

            if (incrementalCost) {
                let positionCost = 0;

                for (let j = 1; j <= diff; j += 1) {
                    positionCost += j;
                }

                cost += positionCost;
            } else {
                cost += diff;
            }
        });

        costs[i] = cost;
    }

    let cheapestCost = -1;

    Object.keys(costs).forEach((position) => {
        if (cheapestCost === -1 || cheapestCost > costs[position]) {
            cheapestCost = costs[position];
        }
    });

    return cheapestCost;
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
