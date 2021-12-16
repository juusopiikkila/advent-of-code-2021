import { strictEqual } from 'assert';
import { chunk, max, min } from 'lodash';
import { getInput } from '../utils';

class Packet {
    version: number

    typeId: number

    private data: string

    private children: Packet[] = []

    constructor(data: string) {
        this.version = parseInt(data.slice(0, 3), 2);
        this.typeId = parseInt(data.slice(3, 6), 2);
        this.data = data.slice(6);

        this.run();
    }

    private getChunks() {
        const chunks = chunk(this.data, 5);
        const arr: string[] = [];

        for (let i = 0; i < chunks.length; i += 1) {
            arr.push(chunks[i].slice(1).join(''));

            if (Number(chunks[i][0]) === 0) {
                break;
            }
        }

        return arr;
    }

    private run() {
        const data = this.data.slice(0);

        if (this.typeId !== 4) {
            const lengthTypeId = Number(data.slice(0, 1));
            const subPacketDataLength = lengthTypeId === 1 ? 11 : 15;
            const length = parseInt(data.slice(1, subPacketDataLength + 1), 2);

            if (lengthTypeId === 0) {
                const subPacketData = data.slice(subPacketDataLength + 1, subPacketDataLength + 1 + length);

                let i = 0;
                while (i < length) {
                    const subPacket = new Packet(subPacketData.slice(i));

                    this.children.push(subPacket);

                    i += subPacket.getDataLength();
                }
            } else if (lengthTypeId === 1) {
                const subPacketData = data.slice(subPacketDataLength + 1);

                let i = 0;
                while (this.children.length < length) {
                    const subPacket = new Packet(subPacketData.slice(i));

                    this.children.push(subPacket);

                    i += subPacket.getDataLength();
                }
            }
        }
    }

    getDataLength() {
        const headerLength = 6;

        if (this.typeId === 4) {
            return headerLength + (this.getChunks().length * 5);
        }

        const lengthTypeId = Number(this.data.slice(0, 1));
        const subPacketDataLength = lengthTypeId === 1 ? 11 : 15;
        const length = parseInt(this.data.slice(1, subPacketDataLength + 1), 2);

        if (lengthTypeId === 0) {
            return headerLength + 1 + subPacketDataLength + length;
        }

        const data = this.data.slice(1 + subPacketDataLength);
        let packetLength = 0;

        for (let i = 0; i < length; i += 1) {
            const subPacket = new Packet(data.slice(packetLength));

            packetLength += subPacket.getDataLength();
        }

        return headerLength + 1 + subPacketDataLength + packetLength;
    }

    getVersionSum(): number {
        return this.version + this.children.reduce((acc, packet) => acc + packet.getVersionSum(), 0);
    }

    getResult(): number {
        if (this.typeId === 0) {
            return this.children.reduce((acc, packet) => acc + packet.getResult(), 0);
        }

        if (this.typeId === 1) {
            return this.children.reduce((acc, packet) => acc * packet.getResult(), 1);
        }

        if (this.typeId === 2) {
            return min(this.children.reduce<number[]>((acc, packet) => [...acc, packet.getResult()], [])) || 0;
        }

        if (this.typeId === 3) {
            return max(this.children.reduce<number[]>((acc, packet) => [...acc, packet.getResult()], [])) || 0;
        }

        if (this.typeId === 4) {
            return parseInt(this.getChunks().join(''), 2);
        }

        if (this.typeId === 5 || this.typeId === 6 || this.typeId === 7) {
            if (this.children.length !== 2) {
                throw new Error('Not enough children');
            }

            const child1 = this.children[0].getResult();
            const child2 = this.children[1].getResult();

            if (this.typeId === 5) {
                return child1 > child2 ? 1 : 0;
            }

            if (this.typeId === 6) {
                return child1 < child2 ? 1 : 0;
            }

            if (this.typeId === 7) {
                return child1 === child2 ? 1 : 0;
            }
        }

        throw new Error('Unknown type ID');
    }
}

function unpackStr(data: string) {
    const map: Record<string, string> = {
        0: '0000',
        1: '0001',
        2: '0010',
        3: '0011',
        4: '0100',
        5: '0101',
        6: '0110',
        7: '0111',
        8: '1000',
        9: '1001',
        A: '1010',
        B: '1011',
        C: '1100',
        D: '1101',
        E: '1110',
        F: '1111',
    };

    return data.split('').map((char) => map[char]).join('');
}

function part1(data: string[]): number {
    return (new Packet(unpackStr(data[0]))).getVersionSum();
}

function part2(data: string[]): number {
    return (new Packet(unpackStr(data[0]))).getResult();
}

async function main() {
    const data = await getInput(__dirname);

    strictEqual((new Packet(unpackStr('8A004A801A8002F478'))).getVersionSum(), 16);
    strictEqual((new Packet(unpackStr('620080001611562C8802118E34'))).getVersionSum(), 12);
    strictEqual((new Packet(unpackStr('C0015000016115A2E0802F182340'))).getVersionSum(), 23);
    strictEqual((new Packet(unpackStr('A0016C880162017C3686B18A3D4780'))).getVersionSum(), 31);

    console.log('Part 1', part1(data));

    strictEqual((new Packet(unpackStr('C200B40A82'))).getResult(), 3);
    strictEqual((new Packet(unpackStr('04005AC33890'))).getResult(), 54);
    strictEqual((new Packet(unpackStr('880086C3E88112'))).getResult(), 7);
    strictEqual((new Packet(unpackStr('CE00C43D881120'))).getResult(), 9);
    strictEqual((new Packet(unpackStr('D8005AC2A8F0'))).getResult(), 1);
    strictEqual((new Packet(unpackStr('F600BC2D8F'))).getResult(), 0);
    strictEqual((new Packet(unpackStr('9C005AC2F8F0'))).getResult(), 0);
    strictEqual((new Packet(unpackStr('9C0141080250320F1802104A08'))).getResult(), 1);

    console.log('Part 2', part2(data));
}

main();
