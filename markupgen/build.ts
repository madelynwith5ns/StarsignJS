import {
    readFileSync,
    readdirSync,
    mkdirSync,
    existsSync,
    rmSync,
} from 'node:fs';
import { $ } from 'bun';

const config = JSON.parse(readFileSync('../starsignrc.json').toString());

const compiler = config.platforms[process.platform].compilers.cpp;

const files = readdirSync('pages-src/');

if (existsSync('pages-bin/')) {
    rmSync('pages-bin/', { force: true, recursive: true });
}
mkdirSync('pages-bin/');

files.forEach((f) => {
    console.log(`[C++] ${f}`);
    $`${compiler} -o pages-bin/${f.replace('.cpp', '.htmlgen')} pages-lib/webfuck.cpp pages-src/${f}`.then(
        (_o) => {},
    );
});
