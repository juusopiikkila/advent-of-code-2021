/* eslint-disable no-continue */
import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

interface Coord {
    x: number
    y: number
}

function getNeighbours(x: number, y: number, maxX: number, maxY: number): Coord[] {
    const arr: Coord[] = [];

    for (let ny = y - 1; ny < y + 2; ny += 1) {
        if (ny < 0 || ny >= maxY) {
            continue;
        }

        for (let nx = x - 1; nx < x + 2; nx += 1) {
            if (nx < 0 || nx >= maxX || (ny === y && nx === x)) {
                continue;
            }

            arr.push({ x: nx, y: ny });
        }
    }

    return arr;
}

function hasFlashable(map: number[][]) {
    return map.reduce((acc, line) => acc + line.filter((num) => num > 9).length, 0) > 0;
}

function runSimulation(data: number[][]): [number[][], number] {
    const map = [...data];
    const maxY = map.length;
    const maxX = map[0].length;
    let count = 0;

    // increase by 1
    for (let y = 0; y < maxY; y += 1) {
        for (let x = 0; x < maxX; x += 1) {
            map[y][x] += 1;
        }
    }

    const ignore: string[] = [];

    do {
        // flash
        for (let y = 0; y < maxY; y += 1) {
            for (let x = 0; x < maxX; x += 1) {
                if (map[y][x] > 9) {
                    count += 1;
                    map[y][x] = 0;

                    ignore.push(`${x}.${y}`);

                    getNeighbours(x, y, maxX, maxY).forEach(({ x: nx, y: ny }) => {
                        if (!ignore.includes(`${nx}.${ny}`)) {
                            map[ny][nx] += 1;
                        }
                    });
                }
            }
        }
    } while (hasFlashable(map));

    return [map, count];
}

function getFlashCount(data: string[], iterations = 100): number {
    let map = data.map((line) => line.split('').map(Number));
    let count = 0;

    for (let i = 0; i < iterations; i += 1) {
        const res = runSimulation(map);

        [map] = res;
        count += res[1];
    }

    return count;
}

function getAllFlashingCounter(data: string[]) {
    let map = data.map((line) => line.split('').map(Number));
    const size = map.reduce((acc, line) => acc + line.length, 0);
    let counter = 0;
    let flashingCount = 0;

    do {
        [map, flashingCount] = runSimulation(map);
        counter += 1;
    } while (flashingCount !== size);

    return counter;
}

function part1(data: string[]): number {
    return getFlashCount(data, 100);
}

function part2(data: string[]): number {
    return getAllFlashingCounter(data);
}

try {
    readFileToArray('./11/input.txt').then((data) => {
        const testData = [
            '5483143223',
            '2745854711',
            '5264556173',
            '6141336146',
            '6357385478',
            '4167524645',
            '2176841721',
            '6882881134',
            '4846848554',
            '5283751526',
        ];

        strictEqual(getFlashCount(testData, 100), 1656);

        console.log('Part 1', part1(data));

        strictEqual(getAllFlashingCounter(testData), 195);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
