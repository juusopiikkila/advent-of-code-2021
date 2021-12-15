import { strictEqual } from 'assert';
import { forEachSeries } from 'async';
import { js as EasyStar } from 'easystarjs';
import { readFileToArray } from '../utils';

interface Coord {
    x: number
    y: number
}

class Map {
    pipes: [Coord, Coord][];

    debug: boolean;

    constructor(data: string[], debug = false) {
        this.pipes = this.getPipes(data);
        this.debug = debug;
    }

    private getPipes(data: string[]) {
        const pipes: [Coord, Coord][] = [];

        data.forEach((line) => {
            const [from, to] = line.split(' -> ').map((c) => c.split(',').map(Number));

            if (!to) {
                console.log(line);
            }

            pipes.push([
                { x: from[0], y: from[1] },
                { x: to[0], y: to[1] },
            ]);
        });

        return pipes;
    }

    private getMax(dir: keyof Coord) {
        return this.pipes.reduce((acc, pipe) => {
            const max = pipe[0][dir] > pipe[1][dir] ? pipe[0][dir] : pipe[1][dir];

            return max > acc ? max : acc;
        }, 0);
    }

    private findPath(map: number[][], pipe: [Coord, Coord]): Promise<Coord[]> {
        return new Promise((resolve) => {
            const easystar = new EasyStar();

            easystar.setGrid(map);
            easystar.setAcceptableTiles([0]);
            easystar.enableDiagonals();

            easystar.findPath(pipe[0].x, pipe[0].y, pipe[1].x, pipe[1].y, (path) => {
                resolve(path);
            });

            easystar.calculate();
        });
    }

    private printMap(map: number[][]) {
        map.forEach((row) => {
            console.log(row.join('').replace(/0/g, '.'));
        });
    }

    private async fill(allDirections: boolean): Promise<number[][]> {
        const maxY = this.getMax('y') + 1;
        const maxX = this.getMax('x') + 1;

        const blankMap = new Array(maxY).fill(Array(maxX).fill(0));

        const map = new Array(maxY);
        for (let i = 0; i < maxY; i += 1) {
            map[i] = Array(maxX).fill(0);
        }

        await forEachSeries(this.pipes, async (pipe) => {
            if (!allDirections && pipe[0].x !== pipe[1].x && pipe[0].y !== pipe[1].y) {
                return;
            }

            const path = await this.findPath(blankMap, pipe);

            path.forEach((coord) => {
                map[coord.y][coord.x] += 1;
            });
        });

        if (this.debug) {
            this.printMap(map);
        }

        return map;
    }

    async getOverlappingCount(allDirections = false) {
        const data = await this.fill(allDirections);

        return data.reduce((acc, line) => acc + line.filter((num) => num > 1).length, 0);
    }
}

async function part1(data: string[]): Promise<number> {
    return (new Map(data)).getOverlappingCount();
}

async function part2(data: string[]): Promise<number> {
    return (new Map(data)).getOverlappingCount(true);
}

try {
    readFileToArray('./5/input.txt').then(async (data) => {
        const testData = [
            '0,9 -> 5,9',
            '8,0 -> 0,8',
            '9,4 -> 3,4',
            '2,2 -> 2,1',
            '7,0 -> 7,4',
            '6,4 -> 2,0',
            '0,9 -> 2,9',
            '3,4 -> 1,4',
            '0,0 -> 8,8',
            '5,5 -> 8,2',
        ];

        strictEqual(await (new Map(testData, true)).getOverlappingCount(), 5);

        console.log('Part 1', await part1(data));

        strictEqual(await (new Map(testData, true)).getOverlappingCount(true), 12);

        console.log('Part 2', await part2(data));
    });
} catch (err) {
    console.log(err);
}
