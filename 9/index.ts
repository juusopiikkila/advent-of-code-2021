import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

type Coord = [number, number];

function getAdjacents(data: string[], x: number, y: number): Coord[] {
    return [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
    ].filter((coord): coord is Coord => data[coord[1]]?.[coord[0]] !== undefined);
}

function getAdjacentValues(data: string[], adjacents: Coord[]): number[] {
    return adjacents.map(([x, y]) => data[y][x])
        .filter((a): a is string => a !== undefined)
        .map(Number)
        .sort();
}

function getLowPoints(data: string[]): Coord[] {
    const lowPoints: Coord[] = [];

    for (let y = 0; y < data.length; y += 1) {
        for (let x = 0; x < data[y].length; x += 1) {
            const adjacents = getAdjacentValues(data, getAdjacents(data, x, y));
            const height = Number(data[y][x]);

            if (height < adjacents[0]) {
                lowPoints.push([x, y]);
            }
        }
    }

    return lowPoints;
}

function getRiskLevel(data: string[]): number {
    return getLowPoints(data).reduce((acc, [x, y]) => acc + 1 + Number(data[y][x]), 0);
}

function getBasins(data: string[], x: number, y: number, previous: Coord[] = []): Coord[] {
    const adjacents = getAdjacents(data, x, y)
        .filter(([cx, cy]) => !previous.map(([ix, iy]) => `${ix}.${iy}`).includes(`${cx}.${cy}`));
    const height = Number(data[y][x]);

    if (height === 9) {
        return [];
    }

    let coords: Coord[] = [
        ...previous,
        [x, y],
    ];

    adjacents.forEach(([ax, ay]) => {
        coords = [
            ...coords,
            ...getBasins(data, ax, ay, coords),
        ];
    });

    return coords.filter((c, index, arr): c is Coord => (
        arr.map(([ix, iy]) => `${ix}.${iy}`).indexOf(`${c[0]}.${c[1]}`) === index
    ));
}

function getLargestBasinValue(data: string[]): number {
    return getLowPoints(data)
        .reduce<number[]>((acc, [x, y]) => [...acc, getBasins(data, x, y).length], [])
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((acc, count) => acc * count, 1);
}

function part1(data: string[]): number {
    return getRiskLevel(data);
}

function part2(data: string[]): number {
    return getLargestBasinValue(data);
}

try {
    readFileToArray('./9/input.txt').then((data) => {
        const testData = [
            '2199943210',
            '3987894921',
            '9856789892',
            '8767896789',
            '9899965678',
        ];

        strictEqual(getRiskLevel(testData), 15);

        console.log('Part 1', part1(data));

        strictEqual(getLargestBasinValue(testData), 1134);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
