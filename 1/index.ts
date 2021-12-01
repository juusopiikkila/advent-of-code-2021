import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getLargerMeasurements(data: string[], sliding = false) {
    let prevMeasure: number;
    let depthIncreases = 0;
    const depths = data.map(Number);

    depths.forEach((depth, index) => {
        const measure = sliding ? depths.slice(index, index + 3).reduce((acc, d) => acc + d, 0) : depth;

        if (prevMeasure && prevMeasure < measure) {
            depthIncreases += 1;
        }

        prevMeasure = measure;
    });

    return depthIncreases;
}

function part1(data: string[]): number {
    return getLargerMeasurements(data);
}

function part2(data: string[]): number {
    return getLargerMeasurements(data, true);
}

try {
    readFileToArray('./1/input.txt').then((data) => {
        const testData = [
            '199',
            '200',
            '208',
            '210',
            '200',
            '207',
            '240',
            '269',
            '260',
            '263',
        ];

        strictEqual(getLargerMeasurements(testData), 7);

        console.log('Part 1', part1(data));

        strictEqual(getLargerMeasurements(testData, true), 5);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
