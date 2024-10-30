#include <cstdio>

/**
 * Generate the page.
 */
int main(int argc, char **argv) {
    for (int i = 0; i < argc; i++) {
        fprintf(stderr, "arg: %s\n", argv[i]);
    }

    printf("<!DOCTYPE html>\n\
            <html>\n\
                <head>\n\
                    <title>Hello from StarsignJS!</title>\n\
                </head>\n\
                <link href='/main.css' rel='stylesheet'/>\n\
                <body>\n\
                    <h1>Hello from StarsignJS!</h1>\n\
                </body>\n\
            </html>\n");
}
