import { strictEqual } from 'assert';
import { readFileToArray } from '../utils';

class Submarine {
    private x = 0;

    private z = 0;

    private aim = 0;

    process(data: string[], aim = false) {
        data.forEach((line) => {
            const [dir, amount] = line.split(' ');
            const numAmount = Number(amount);

            if (aim) {
                if (dir === 'forward') {
                    this.x += numAmount;
                    this.z += numAmount * this.aim;
                } else if (dir === 'up') {
                    this.aim -= numAmount;
                } else if (dir === 'down') {
                    this.aim += numAmount;
                }
            } else if (dir === 'forward') {
                this.x += numAmount;
            } else if (dir === 'up') {
                this.z -= numAmount;
            } else if (dir === 'down') {
                this.z += numAmount;
            }
        });

        return this;
    }

    getHorizontalPosition() {
        return this.x * this.z;
    }
}

function part1(data: string[]): number {
    return (new Submarine()).process(data).getHorizontalPosition();
}

function part2(data: string[]): number {
    return (new Submarine()).process(data, true).getHorizontalPosition();
}

try {
    readFileToArray('./2/input.txt').then((data) => {
        const testData = [
            'forward 5',
            'down 5',
            'forward 8',
            'up 3',
            'down 8',
            'forward 2',
        ];

        strictEqual((new Submarine().process(testData).getHorizontalPosition()), 150);

        console.log('Part 1', part1(data));

        strictEqual((new Submarine().process(testData, true).getHorizontalPosition()), 900);

        console.log('Part 2', part2(data));
    });
} catch (err) {
    console.log(err);
}
