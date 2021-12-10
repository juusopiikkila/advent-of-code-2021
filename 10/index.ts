import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function checkCorruption(data: string): [string, string, string[]] {
    const openerPairs: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
    };
    const closerPairs: Record<string, string> = {
        ')': '(',
        ']': '[',
        '}': '{',
        '>': '<',
    };
    const chars = data.split('');
    const openers = Object.keys(openerPairs);
    const closers = Object.keys(closerPairs);
    const openPairs: string[] = [];

    for (let i = 0; i < chars.length; i += 1) {
        const char = chars[i];

        if (closers.includes(char)) {
            if (openPairs[openPairs.length - 1] !== closerPairs[char]) {
                return [
                    openerPairs[openPairs[openPairs.length - 1]],
                    char,
                    openPairs,
                ];
            }

            openPairs.pop();
        }

        if (openers.includes(char)) {
            openPairs.push(char);
        }
    }

    return ['', '', openPairs];
}

function getCorruptedScore(data: string[]) {
    const points: Record<string, number> = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    };

    return data.reduce((acc, line) => {
        const res = checkCorruption(line);

        if (!res[0].length) {
            return acc;
        }

        return acc + points[res[1]];
    }, 0);
}

function getIncompleteScore(data: string[]) {
    const points: Record<string, number> = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    };
    const openerPairs: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
    };
    const totals = data.reduce<number[]>((acc, line) => {
        const res = checkCorruption(line);

        if (res[0].length || !res[2].length) {
            return acc;
        }

        return [
            ...acc,
            res[2].reverse().map((char) => openerPairs[char])
                .reduce((acc2, char) => (acc2 * 5) + points[char], 0),
        ];
    }, []);

    totals.sort((a, b) => a - b);

    return totals[Math.floor(totals.length / 2)];
}

function part1(data: string[]): number {
    return getCorruptedScore(data);
}

function part2(data: string[]): number {
    return getIncompleteScore(data);
}

try {
    readFileToArray('./10/input.txt').then((data) => {
        const testData = [
            '[({(<(())[]>[[{[]{<()<>>',
            '[(()[<>])]({[<{<<[]>>(',
            '{([(<{}[<>[]}>{[]{[(<()>',
            '(((({<>}<{<{<>}{[]{[]{}',
            '[[<[([]))<([[{}[[()]]]',
            '[{[{({}]{}}([{[{{{}}([]',
            '{<[[]]>}<{[{[{[]{()[[[]',
            '[<(<(<(<{}))><([]([]()',
            '<{([([[(<>()){}]>(<<{{',
            '<{([{{}}[<[[[<>{}]]]>[]]',
        ];

        strictEqual(getCorruptedScore(testData), 26397);

        console.log('Part 1', part1(data));

        strictEqual(getIncompleteScore(testData), 288957);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
