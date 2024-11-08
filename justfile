build: frontend markupgen bundle
pretty: prettier

frontend:
    cd frontend && just build

markupgen:
    cd markupgen && just build

bundle:
    rm -rf dist
    mkdir dist
    cp -r frontend/dist/* dist

prettier:
    bun prettier . --write
    bun eslint src/ --fix
