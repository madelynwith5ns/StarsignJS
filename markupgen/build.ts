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

const libs = readdirSync('pages-lib/');
let libsflags: string[] = [];
libs.forEach((f) => {
    if (f.endsWith('.cpp')) {
        libsflags.push(`pages-lib/${f}`);
    }
});

const files = readdirSync('pages-src/');

if (existsSync('pages-bin/')) {
    rmSync('pages-bin/', { force: true, recursive: true });
}
mkdirSync('pages-bin/');

files.forEach((f) => {
    console.log(`[C++] ${f}`);
    $`${compiler} -o pages-bin/${f.replace('.cpp', '.htmlgen')} -Ipages-lib/ ${libsflags} pages-src/${f}`.then(
        (_o) => {},
    );
});
