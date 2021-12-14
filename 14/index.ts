// inspiration for part 2 from https://github.com/N8Brooks/deno_aoc/blob/main/year_2021/day_14.ts

import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getElementCounts(data: string[], iterations = 10) {
    const template = data[0].split('');
    const rules = data.slice(2).map((line) => line.split(' -> ').join('').split(''));
    const emptyCounts: Record<string, number> = Object.fromEntries(rules.map((r) => [r.slice(0, 2).join(''), 0]));
    let counts = { ...emptyCounts };

    const chunks: string[] = [];
    for (let i = 0; i < template.length - 1; i += 1) {
        const str = template.slice(i, i + 2).join('');

        chunks.push(str);
        counts[str] += 1;
    }

    for (let i = 0; i < iterations; i += 1) {
        const currentCounts = { ...emptyCounts };

        // eslint-disable-next-line no-loop-func
        rules.forEach(([a, b, c]) => {
            currentCounts[a + c] += counts[a + b];
            currentCounts[c + b] += counts[a + b];
        });

        counts = { ...currentCounts };
    }

    const charCounts: Record<string, number> = {
        [template[0]]: 1,
    };

    Object.entries(counts).forEach(([chars, count]) => {
        if (charCounts[chars[1]] === undefined) {
            charCounts[chars[1]] = 0;
        }

        charCounts[chars[1]] += count;
    });

    const chars = Object.entries(charCounts).sort((a, b) => a[1] - b[1]);

    return chars[chars.length - 1][1] - chars[0][1];
}

function part1(data: string[]): number {
    return getElementCounts(data);
}

function part2(data: string[]): number {
    return getElementCounts(data, 40);
}

try {
    readFileToArray('./14/input.txt').then((data) => {
        const testData = [
            'NNCB',
            '',
            'CH -> B',
            'HH -> N',
            'CB -> H',
            'NH -> C',
            'HB -> C',
            'HC -> B',
            'HN -> C',
            'NN -> C',
            'BH -> H',
            'NC -> B',
            'NB -> B',
            'BN -> B',
            'BB -> N',
            'BC -> B',
            'CC -> N',
            'CN -> C',
        ];

        strictEqual(getElementCounts(testData), 1588);

        console.log('Part 1', part1(data));

        strictEqual(getElementCounts(testData, 40), 2188189693529);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
