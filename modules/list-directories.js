import fs from 'fs'
import path from 'path'

export default function listDirectories(directory, base) {
    directory = base ? path.join(base, directory) : directory;
    return fs
        .readdirSync(directory)
        .filter(file => fs.statSync(path.join(directory, file)).isDirectory());
}
