import { strictEqual } from 'assert';
import { max } from 'lodash';
import { getInput } from '../utils';

class Probe {
    x = 0

    y = 0

    maxY = 0

    private vX: number

    private vY: number

    constructor(vX: number, vY: number) {
        this.vX = vX;
        this.vY = vY;
    }

    step() {
        this.x += this.vX;
        this.y += this.vY;

        if (this.y > this.maxY) {
            this.maxY = this.y;
        }

        if (this.vX > 0) {
            this.vX -= 1;
        } else if (this.vX < 0) {
            this.vX += 1;
        }

        this.vY -= 1;
    }
}

class Submarine {
    targetX: [number, number]

    targetY: [number, number]

    constructor(data: string) {
        const matches = data.match(/x=([0-9-]+)\.\.([0-9-]+), y=([0-9-]+)\.\.([0-9-]+)/);
        if (!matches) {
            throw new Error('No matches');
        }

        this.targetX = [Number(matches[1]), Number(matches[2])];
        this.targetY = [Number(matches[3]), Number(matches[4])];
    }

    private isInTargetArea(probe: Probe) {
        return probe.x >= this.targetX[0] && probe.x <= this.targetX[1]
            && probe.y >= this.targetY[0] && probe.y <= this.targetY[1];
    }

    private isOutOfBounds(probe: Probe) {
        return probe.x > this.targetX[1] || probe.y < this.targetY[0];
    }

    private getSuccessfulThrows() {
        const successes: Probe[] = [];
        const vYMax = max(this.targetY.map((num) => Math.abs(num))) || 0;
        const vXMax = (max(this.targetX) || 0) + 1;

        for (let vY = vYMax * -1; vY < vYMax; vY += 1) {
            for (let vX = 0; vX < vXMax; vX += 1) {
                const probe = new Probe(vX, vY);

                while (!this.isOutOfBounds(probe)) {
                    probe.step();

                    if (this.isInTargetArea(probe)) {
                        successes.push(probe);
                        break;
                    }
                }
            }
        }

        return successes;
    }

    getSuccessfulVelocitiesCount() {
        return this.getSuccessfulThrows().length;
    }

    getHighestTrajectory() {
        return max(this.getSuccessfulThrows().map((probe) => probe.maxY)) || 0;
    }
}

function part1(data: string[]): number {
    return (new Submarine(data[0])).getHighestTrajectory();
}

function part2(data: string[]): number {
    return (new Submarine(data[0])).getSuccessfulVelocitiesCount();
}

async function main() {
    const data = await getInput(__dirname);

    strictEqual((new Submarine('target area: x=20..30, y=-10..-5')).getHighestTrajectory(), 45);

    console.log('Part 1', part1(data));

    strictEqual((new Submarine('target area: x=20..30, y=-10..-5')).getSuccessfulVelocitiesCount(), 112);

    console.log('Part 2', part2(data));
}

main();
