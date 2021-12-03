import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getMostCommonBit(data: string[], index: number) {
    const bits: number[] = data.map((line) => Number(line[index]));

    return bits.filter((b) => b === 1).length >= bits.length / 2 ? 1 : 0;
}

function getPowerConsumption(data: string[]) {
    const gamma: number[] = [];
    const dataLength = data[0].length;

    for (let i = 0; i < dataLength; i += 1) {
        gamma.push(getMostCommonBit(data, i));
    }

    const epsilon = gamma.map((g) => (g ? 0 : 1));

    return parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2);
}

function getLifeSupportRating(data: string[]) {
    const dataLength = data[0].length;

    let oxygenData = [...data];
    for (let i = 0; i < dataLength; i += 1) {
        const mostCommon = getMostCommonBit(oxygenData, i);

        if (oxygenData.length <= 1) {
            break;
        }

        oxygenData = oxygenData.filter((line) => Number(line[i]) === mostCommon);
    }

    let co2ScrubberData = [...data];
    for (let i = 0; i < dataLength; i += 1) {
        const mostCommon = getMostCommonBit(co2ScrubberData, i);

        if (co2ScrubberData.length <= 1) {
            break;
        }

        co2ScrubberData = co2ScrubberData.filter((line) => Number(line[i]) !== mostCommon);
    }

    return parseInt(oxygenData[0], 2) * parseInt(co2ScrubberData[0], 2);
}

function part1(data: string[]): number {
    return getPowerConsumption(data);
}

function part2(data: string[]): number {
    return getLifeSupportRating(data);
}

try {
    readFileToArray('./3/input.txt').then((data) => {
        const testData = [
            '00100',
            '11110',
            '10110',
            '10111',
            '10101',
            '01111',
            '00111',
            '11100',
            '10000',
            '11001',
            '00010',
            '01010',
        ];

        strictEqual(getPowerConsumption(testData), 198);

        console.log('Part 1', part1(data));

        strictEqual(getLifeSupportRating(testData), 230);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
