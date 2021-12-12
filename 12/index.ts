import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Cave {
    type: 'big' | 'small'

    name: string

    private connections: Cave[] = []

    constructor(name: string) {
        this.name = name;
        this.type = name === name.toUpperCase() ? 'big' : 'small';
    }

    addConnection(cave: Cave) {
        this.connections.push(cave);
    }

    getConnections() {
        return this.connections;
    }
}

class Runner {
    private current: Cave

    private visited: Cave[] = []

    private allowSecondarySmallVisit: boolean

    constructor(current: Cave, visited: Cave[], allowSecondarySmallVisit: boolean) {
        this.current = current;
        this.visited = visited;
        this.allowSecondarySmallVisit = allowSecondarySmallVisit;
    }

    isFinished() {
        return this.current.name === 'end';
    }

    proceed() {
        const visited = [...this.visited, this.current];

        return this.current.getConnections()
            .filter((cave) => {
                if (cave.type === 'big') {
                    return true;
                }

                if (cave.name === 'start') {
                    return false;
                }

                if (this.allowSecondarySmallVisit && cave.type === 'small') {
                    const visitCounts: Record<string, number> = {};
                    visited.filter((c) => c.type === 'small').forEach((c) => {
                        if (visitCounts[c.name] === undefined) {
                            visitCounts[c.name] = 0;
                        }

                        visitCounts[c.name] += 1;
                    });

                    if (!Object.values(visitCounts).filter((num) => num > 1).length) {
                        return true;
                    }
                }

                return !this.visited.find((c) => c.name === cave.name);
            })
            .reduce<Runner[]>((acc, cave) => [...acc, new Runner(cave, visited, this.allowSecondarySmallVisit)], []);
    }
}

class Map {
    private caves: Cave[]

    constructor(data: string[]) {
        this.caves = this.getCaves(data);
    }

    private getCaves(data: string[]) {
        const caves: Record<string, Cave> = {};

        data.forEach((line) => {
            const [cave1Name, cave2Name] = line.split('-');

            if (caves[cave1Name] === undefined) {
                caves[cave1Name] = new Cave(cave1Name);
            }

            if (caves[cave2Name] === undefined) {
                caves[cave2Name] = new Cave(cave2Name);
            }

            caves[cave1Name].addConnection(caves[cave2Name]);
            caves[cave2Name].addConnection(caves[cave1Name]);
        });

        return Object.values(caves);
    }

    private getCave(name: string) {
        const cave = this.caves.find((c) => c.name === name);

        if (!cave) {
            throw new Error('Cave not found');
        }

        return cave;
    }

    getPathCount(allowSecondarySmallVisit = false) {
        const start = this.getCave('start');
        let runners = [
            new Runner(start, [], allowSecondarySmallVisit),
        ];

        let finished: Runner[] = [];

        while (runners.length) {
            let newRunners: Runner[] = [];

            runners.forEach((runner) => {
                newRunners = [
                    ...newRunners,
                    ...runner.proceed(),
                ];
            });

            finished = [
                ...finished,
                ...newRunners.filter((r) => r.isFinished()),
            ];

            runners = newRunners.filter((r) => !r.isFinished());
        }

        return finished.length;
    }
}

function part1(data: string[]): number {
    return (new Map(data)).getPathCount();
}

function part2(data: string[]): number {
    return (new Map(data)).getPathCount(true);
}

try {
    readFileToArray('./12/input.txt').then((data) => {
        const testData = [
            'start-A',
            'start-b',
            'A-c',
            'A-b',
            'b-d',
            'A-end',
            'b-end',
        ];
        const testData2 = [
            'dc-end',
            'HN-start',
            'start-kj',
            'dc-start',
            'dc-HN',
            'LN-dc',
            'HN-end',
            'kj-sa',
            'kj-HN',
            'kj-dc',
        ];
        const testData3 = [
            'fs-end',
            'he-DX',
            'fs-he',
            'start-DX',
            'pj-DX',
            'end-zg',
            'zg-sl',
            'zg-pj',
            'pj-he',
            'RW-he',
            'fs-DX',
            'pj-RW',
            'zg-RW',
            'start-pj',
            'he-WI',
            'zg-he',
            'pj-fs',
            'start-RW',
        ];

        strictEqual((new Map(testData)).getPathCount(), 10);
        strictEqual((new Map(testData2)).getPathCount(), 19);
        strictEqual((new Map(testData3)).getPathCount(), 226);

        console.log('Part 1', part1(data));

        strictEqual((new Map(testData)).getPathCount(true), 36);
        strictEqual((new Map(testData2)).getPathCount(true), 103);
        strictEqual((new Map(testData3)).getPathCount(true), 3509);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
