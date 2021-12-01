import { readFile } from 'fs/promises';

export async function readFileToArray(path: string): Promise<string[]> {
    const data = await readFile(path);
    return data.toString().split('\n').slice(0, -1);
}
