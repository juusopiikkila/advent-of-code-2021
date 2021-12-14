import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getElementCounts(data: string[], iterations = 10) {
    let template = data[0].split('');
    const pairs = data.slice(2).map((line) => line.split(' -> '));

    for (let i = 0; i < iterations; i += 1) {
        const newTemplate: string[] = [];

        for (let j = 0; j < template.length; j += 1) {
            const str = template.slice(j, j + 2).join('');
            const pair = pairs.find((p) => p[0] === str);

            if (pair) {
                newTemplate.push(`${str[0]}${pair[1]}`);
            } else {
                newTemplate.push(str);
            }
        }

        template = newTemplate.join('').split('');
    }

    const counts: { char: string; count: number }[] = [];

    template.forEach((char) => {
        let item = counts.find((c) => c.char === char);

        if (!item) {
            item = {
                char,
                count: 0,
            };

            counts.push(item);
        }

        item.count += 1;
    });

    counts.sort((a, b) => a.count - b.count);

    return counts[counts.length - 1].count - counts[0].count;
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

        // strictEqual(test(14), 2);

        // console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
