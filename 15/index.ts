import { strictEqual } from 'assert';
import { js as EasyStar } from 'easystarjs';
import { readFileToArray } from '../utils';

interface Coord {
    x: number
    y: number
}

async function findPath(map: number[][], from: Coord, to: Coord): Promise<Coord[]> {
    return new Promise((resolve) => {
        const easystar = new EasyStar();

        easystar.setGrid(map);
        easystar.setAcceptableTiles([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let i = 0; i < 10; i += 1) {
            easystar.setTileCost(i, i);
        }

        easystar.findPath(from.x, from.y, to.x, to.y, (path) => {
            resolve(path);
        });

        easystar.calculate();
    });
}

async function getLowestRiskCost(data: string[], expandMap = false) {
    let map = data.map((line) => line.split('').map(Number));

    if (expandMap) {
        const repeat = 5;
        const height = map.length;
        const width = map[0].length;
        const newMap: number[][] = [];

        for (let y = 0; y < height * repeat; y += 1) {
            newMap.push((new Array(width * repeat)).fill(0));
        }

        map.forEach((line, y) => {
            line.forEach((num, x) => {
                for (let i = 0; i < repeat; i += 1) {
                    for (let j = 0; j < repeat; j += 1) {
                        const newY = y + (i * height);
                        const newX = x + (j * width);
                        const newNum = (num + i + j) % 9;

                        newMap[newY][newX] = newNum === 0 ? 9 : newNum;
                    }
                }
            });
        });

        map = newMap;
    }

    const path = await findPath(
        map,
        {
            x: 0,
            y: 0,
        },
        {
            x: map[0].length - 1,
            y: map.length - 1,
        },
    );

    return path.reduce((acc, { x, y }, index) => acc + (index ? map[y][x] : 0), 0);
}

async function part1(data: string[]): Promise<number> {
    return getLowestRiskCost(data);
}

async function part2(data: string[]): Promise<number> {
    return getLowestRiskCost(data, true);
}

try {
    readFileToArray(`${__dirname}/input.txt`).then(async (data) => {
        const testData = [
            '1163751742',
            '1381373672',
            '2136511328',
            '3694931569',
            '7463417111',
            '1319128137',
            '1359912421',
            '3125421639',
            '1293138521',
            '2311944581',
        ];

        strictEqual(await getLowestRiskCost(testData), 40);

        console.log('Part 1', await part1(data));

        strictEqual(await getLowestRiskCost(testData, true), 315);

        console.log('Part 2', await part2(data));
    });
} catch (err) {
    console.log(err);
}
