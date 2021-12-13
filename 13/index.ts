import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

function getDotsAfterFolding(
    data: string[],
    maxFolds: number | undefined = undefined,
): [number, string[][]] {
    const coords = data.filter((line) => line.match(/^[0-9]+,[0-9]+$/)).map((line) => line.split(',').map(Number));
    const folds = data.filter((line) => line.match(/^fold along/))
        .map((line) => line.match(/^fold along (x|y)=([0-9]+)$/)?.slice(1, 3))
        .filter((line): line is string[] => !!line);

    const [width, height] = coords.reduce((acc, c) => [
        c[0] > acc[0] ? c[0] : acc[0],
        c[1] > acc[1] ? c[1] : acc[1],
    ], [0, 0]);

    let paper: string[][] = [];
    for (let i = 0; i <= height; i += 1) {
        paper.push((new Array(width + 1)).fill('.'));
    }

    coords.forEach(([x, y]) => {
        paper[y][x] = '#';
    });

    for (let f = 0; f < (maxFolds || folds.length); f += 1) {
        const direction = folds[f][0];
        const index = Number(folds[f][1]);
        let paper1: string[][] = [];
        let paper2: string[][] = [];

        if (direction === 'y') {
            paper1 = paper.slice(0, index);
            paper2 = paper.slice(index + 1, index + index + 1).reverse();

            while (paper2.length < paper1.length) {
                paper2.unshift(new Array(paper2[0].length).fill('.'));
            }
        } else if (direction === 'x') {
            paper1 = paper.map((line) => line.slice(0, index));
            paper2 = paper.map((line) => line.slice(index + 1, index + index + 1).reverse());
        }

        const newHeight = paper1.length;
        const newWidth = paper1[0].length;

        const newPaper: string[][] = [];
        for (let i = 0; i < newHeight; i += 1) {
            const row: string[] = [];

            for (let j = 0; j < newWidth; j += 1) {
                row.push(paper1[i]?.[j] === '#' || paper2[i]?.[j] === '#' ? '#' : '.');
            }

            newPaper.push(row);
        }

        paper = newPaper;
    }

    return [
        paper.reduce((acc, line) => acc + line.filter((char) => char === '#').length, 0),
        paper,
    ];
}

function part1(data: string[]): number {
    return getDotsAfterFolding(data, 1)[0];
}

function part2(data: string[]) {
    const paper = getDotsAfterFolding(data)[1];

    paper.forEach((line) => console.log(line.join('')));
}

try {
    readFileToArray('./13/input.txt').then((data) => {
        const testData = [
            '6,10',
            '0,14',
            '9,10',
            '0,3',
            '10,4',
            '4,11',
            '6,0',
            '6,12',
            '4,1',
            '0,13',
            '10,12',
            '3,4',
            '3,0',
            '8,4',
            '1,10',
            '2,14',
            '8,10',
            '9,0',
            '',
            'fold along y=7',
            'fold along x=5',
        ];

        strictEqual(getDotsAfterFolding(testData, 1)[0], 17);

        console.log('Part 1', part1(data));

        console.log('Part 2');
        part2(data);
    });
} catch (err) {
    console.log(err);
}
