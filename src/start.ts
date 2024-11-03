/* eslint-disable */

import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { $ } from 'bun';

// eslint-ignore-next-line
export type UserAgent<_T> = string;
// eslint-ignore-next-line
export type HTTPUserAgent = UserAgent<string>;
// eslint-ignore-next-line
export type Foo = string;
// eslint-ignore-next-line
export type Bar<_T> = Foo;
// eslint-ignore-next-line
export type Baz<_F, B> = Bar<B>;
// eslint-ignore-next-line
export type SendableDataString<_T, _U> = string;
// eslint-ignore-next-line
export type WebObject<T> = SendableDataString<T, HTTPUserAgent>;
// eslint-ignore-next-line
export type HTML<_T> = WebObject<string>;
// eslint-ignore-next-line
export type CSS<_T> = WebObject<string>;
// eslint-ignore-next-line
export type WebHTML = WebObject<HTML<Baz<string, string>>>;
// eslint-ignore-next-line
export type WebCSS = WebObject<CSS<Baz<string, string>>>;
// eslint-ignore-next-line
export type WebResponse<_T> = Response;
// eslint-ignore-next-line
export type WebHTMLResponse = WebResponse<WebHTML>;
// eslint-ignore-next-line
export type WebCSSResponse = WebResponse<WebCSS>;

export class Route {
    private executable: string;
    private name: string;

    public constructor(name: string) {
        this.executable = `./markupgen/pages-bin/${name}.htmlgen`;
        this.name = name;
    }

    public getExecutable(): string {
        return this.executable;
    }

    public getName(): string {
        return this.name;
    }

    public generateStaticRepresentation(): Promise<WebHTMLResponse> {
        return new Promise(
            (resolveThePromiseWeAreIn, _rejectThePromiseWeAreIn) => {
                $`${this.getExecutable()} X-StarsignJS-Generate-For=static User-Agent=StarsignJS Accept=text/html`.then(
                    (output) => {
                        const html = output.stdout.toString();
                        resolveThePromiseWeAreIn(
                            new Response(html, {
                                headers: {
                                    'Content-Type': 'text/html',
                                    Server: 'StarsignJS',
                                },
                            }),
                        );
                    },
                );
            },
        );
    }

    public generateFor(req: Request): Promise<WebHTMLResponse> {
        return new Promise(
            (resolveThePromiseWeAreIn, _rejectThePromiseWeAreIn) => {
                let reqfile = `.reqpassdir/${Math.floor(Math.random() * 100000)}.request`;
                writeFileSync(
                    reqfile,
                    JSON.stringify({
                        headers: req.headers,
                    }),
                );

                $`${this.getExecutable()} ${reqfile}`.then((output) => {
                    const html = output.stdout.toString();
                    rmSync(reqfile);
                    resolveThePromiseWeAreIn(
                        new Response(html, {
                            headers: {
                                'Content-Type': 'text/html',
                                Server: 'StarsignJS',
                            },
                        }),
                    );
                });
            },
        );
    }
}

export class CSSGenerator {
    private script: string;
    private name: string;

    public constructor(name: string) {
        this.script = `./cssgen/xss/${name}.xss`;
        this.name = name;
    }

    public getExecutable(): string {
        return this.script;
    }

    public getName(): string {
        return this.name;
    }

    public generate(): Promise<WebCSSResponse> {
        return new Promise(
            (resolveThePromiseWeAreIn, _rejectThePromiseWeAreIn) => {
                $`${this.getExecutable()}`.then((output) => {
                    const css = output.stdout.toString();
                    resolveThePromiseWeAreIn(
                        new Response(css, {
                            headers: {
                                'Content-Type': 'text/css',
                                Server: 'StarsignJS',
                            },
                        }),
                    );
                });
            },
        );
    }
}
export class Server {
    private readonly routes: Route[];
    private readonly cssgenerators: CSSGenerator[];

    public constructor() {
        this.routes = [];
        this.cssgenerators = [];
    }

    public start() {
        console.log('Starsign.JS - 🌟 The Best Web Framework 🌟');
        console.log("Just like astrology, it's real!");

        if (!existsSync('.reqpassdir')) {
            mkdirSync('.reqpassdir');
        }

        readdirSync('./markupgen/pages-bin/', { recursive: true }).forEach(
            (f) => {
                if (typeof f !== 'string') return;
                if (!f.endsWith('.htmlgen')) return;
                f = f.substring(0, f.indexOf('.htmlgen'));
                console.log(`Mounting route: /${f}`);
                this.routes.push(new Route(`/${f}`));
            },
        );
        readdirSync('./cssgen/xss/', { recursive: true }).forEach((f) => {
            if (typeof f !== 'string') return;
            if (!f.endsWith('.xss')) return;
            f = f.substring(0, f.indexOf('.xss'));
            console.log(`Mounting XSS Provider: /${f}`);
            this.cssgenerators.push(new CSSGenerator(`/${f}`));
        });

        const server = this;
        Bun.serve({
            fetch(req) {
                const url = new URL(req.url);
                const path = url.pathname === '/' ? '/index' : url.pathname;

                const dirread = readdirSync('dist/', { recursive: true });
                const dir = dirread.map((f) => {
                    return '/' + f.toString();
                });

                if (dir.includes(path)) {
                    return new Response(String(readFileSync(`dist${path}`)), {
                        headers: {
                            'Content-Type': path.endsWith('.js')
                                ? 'text/javascript'
                                : path.endsWith('.html')
                                  ? 'text/html'
                                  : path.endsWith('.css')
                                    ? 'text/css'
                                    : path.endsWith('.wf')
                                      ? 'xd-nya~/webfuck'
                                      : 'text/plain',

                            Server: 'StarsignJS',
                        },
                    });
                } else if (path.endsWith('.css')) {
                    for (let i = 0; i < server.cssgenerators.length; i++) {
                        if (
                            server.cssgenerators[i].getName() + '.css' !==
                            path
                        ) {
                            continue;
                        }
                        return server.cssgenerators[i].generate();
                    }
                } else {
                    for (let i = 0; i < server.routes.length; i++) {
                        if (server.routes[i].getName() !== path) {
                            continue;
                        }
                        return server.routes[i].generateFor(req);
                    }
                }
                return Response.json(
                    { status: 404, details: 'Not Found' },
                    {
                        headers: {
                            Server: 'StarsignJS',
                        },
                    },
                );
            },
        });
    }
}

/* eslint-enable */
