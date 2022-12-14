import { strictEqual } from 'assert';
import { intersection } from 'lodash';
import { readFileToArray } from '../utils';

class Solver {
    private signal: string[]

    private output: string[]

    digitSegments = [
        [0, 1, 2, 4, 5, 6], // 0
        [2, 5], // 1
        [0, 2, 3, 4, 6], // 2
        [0, 2, 3, 5, 6], // 3
        [1, 2, 3, 5], // 4
        [0, 1, 3, 5, 6], // 5
        [0, 1, 3, 4, 5, 6], // 6
        [0, 2, 5], // 7
        [0, 1, 2, 3, 4, 5, 6], // 8
        [0, 1, 2, 3, 5, 6], // 9
    ]

    constructor(line: string) {
        const [signal, output] = line.split(' | ');

        this.signal = signal.split(' ');
        this.output = output.split(' ');
    }

    private getSimpleDigit(value: string): number | undefined {
        if (value.length === 2) {
            return 1;
        }

        if (value.length === 4) {
            return 4;
        }

        if (value.length === 3) {
            return 7;
        }

        if (value.length === 7) {
            return 8;
        }

        return undefined;
    }

    getSimpleDigitOccurrencesInOutput() {
        return this.output.reduce((acc, value) => acc + (this.getSimpleDigit(value) ? 1 : 0), 0);
    }

    private getDigitCharsFromMap(digit: number, map: Record<string, number>): string[] {
        const index = Object.values(map).indexOf(digit);

        return Object.keys(map)[index].split('');
    }

    private getDeducedDigit(segments: string[], value: string, map: Record<string, number>): number {
        const seg = value.split('').map((char) => segments.indexOf(char)).sort().join('');
        const digits = this.digitSegments.map((digit) => digit.join(''));
        const splitValue = value.split('');

        if (value.length === 6) {
            // 0, 6, 9
            if (intersection(splitValue, this.getDigitCharsFromMap(4, map)).length === 4) {
                return 9;
            }

            if (intersection(splitValue, this.getDigitCharsFromMap(7, map)).length === 3) {
                return 0;
            }

            return 6;
        }

        if (value.length === 5) {
            // 2, 3, 5
            if (intersection(splitValue, this.getDigitCharsFromMap(7, map)).length === 3) {
                return 3;
            }

            if (intersection(splitValue, this.getDigitCharsFromMap(4, map)).length === 3) {
                return 5;
            }

            return 2;
        }

        return digits.indexOf(seg);
    }

    private getSegmentsFromMap(map: Record<string, number>): string[] {
        const segments = [0, 1, 2, 3, 4, 5, 6];
        const segmentPossibilities: string[][] = [
            [], // 0
            [], // 1
            [], // 2
            [], // 3
            [], // 4
            [], // 5
            [], // 6
        ].map(() => 'abcdefg'.split(''));

        Object.keys(map).forEach((value) => {
            const digit = map[value];

            this.digitSegments[digit].forEach((num) => {
                segmentPossibilities[num] = segmentPossibilities[num].filter((char) => value.includes(char));
            });

            const excessSegments = [...segments].filter((num) => !this.digitSegments[digit].includes(num));

            excessSegments.forEach((num) => {
                segmentPossibilities[num] = segmentPossibilities[num].filter((char) => !value.includes(char));
            });
        });

        while (segmentPossibilities.reduce((acc, s) => acc + s.length, 0) !== segmentPossibilities.length) {
            const okSegments = segmentPossibilities
                .filter((possibilities) => possibilities.length === 1)
                .reduce((acc, s) => [...acc, ...s], []);

            for (let i = 0; i < segmentPossibilities.length; i += 1) {
                if (segmentPossibilities[i].length > 1) {
                    segmentPossibilities[i] = segmentPossibilities[i].filter((char) => !okSegments.includes(char));
                }
            }

            for (let i = 0; i < segmentPossibilities.length; i += 1) {
                for (let j = 0; j < segmentPossibilities.length; j += 1) {
                    if (i !== j && segmentPossibilities[i].join('') === segmentPossibilities[j].join('')) {
                        const { length } = segmentPossibilities[i];
                        const half = Math.floor(length / 2);

                        segmentPossibilities[i] = segmentPossibilities[i].slice(0, half);
                        segmentPossibilities[j] = segmentPossibilities[j].slice(half);
                    }
                }
            }
        }

        return segmentPossibilities.map((segment) => segment[0]);
    }

    getOutput() {
        const map: Record<string, number> = {};
        const allValues = [...this.signal, ...this.output]
            .map((value) => value.split('').sort().join(''))
            .filter((value, index, array) => array.indexOf(value) === index);

        allValues.forEach((value) => {
            const digit = this.getSimpleDigit(value);

            if (digit) {
                map[value] = digit;
            }
        });

        const segments = this.getSegmentsFromMap(map);

        return Number(this.output.reduce((acc, value) => `${acc}${this.getDeducedDigit(segments, value, map)}`, ''));
    }
}

function getOccurrences(data: string[]): number {
    return data.reduce((acc, line) => {
        const solver = new Solver(line);

        return acc + solver.getSimpleDigitOccurrencesInOutput();
    }, 0);
}

function getOutputs(data: string[]): number {
    return data.reduce((acc, line) => {
        const solver = new Solver(line);

        return acc + solver.getOutput();
    }, 0);
}

function part1(data: string[]): number {
    return getOccurrences(data);
}

function part2(data: string[]): number {
    return getOutputs(data);
}

try {
    readFileToArray('./8/input.txt').then((data) => {
        const testData = [
            'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe',
            'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc',
            'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg',
            'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb',
            'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea',
            'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb',
            'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe',
            'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef',
            'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb',
            'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce',
        ];

        strictEqual(getOccurrences(testData), 26);

        console.log('Part 1', part1(data));

        strictEqual(getOutputs(testData), 61229);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
