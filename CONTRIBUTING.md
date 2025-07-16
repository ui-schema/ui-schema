# Contributing to UI-Schema

This repository is a monorepo, managed with lerna and npm workspaces.

1. Fork/Clone repository **branch: `develop`**
2. Install root dev-dependencies (like lerna, webpack): `npm i --legacy-peer-deps`
3. Start dev-server: `npm start`
    - (will clean-dist + start demo-web app)
    - to starts docs app: `npm start -- --serve docs`
    - to starts picker demo app: `npm start -- --serve pickersDemo`
4. Open browser on [localhost:4200](http://localhost:4200) for demo-web, [localhost:4201](http://localhost:4201) for docs
5. Explore [packages](packages)
6. Code -> Commit -> Pull Request -> Being Awesome!

Changes from any package are reflected inside the demo-web/docs package.

See current *[packages/demo-web@master](https://ui-schema-demo.netlify.app/)* or
*[packages/demo-web@develop](https://develop--ui-schema-demo.netlify.app/)*

---

```shell
npm i --legacy-peer-deps
npm start
# npm start -- --serve docs

# npm run check
# npm run build

# clean install / remake package-lock
# npm run clean && npm run clean-lock && rm -rf node_modules && rm -f package-lock.json && npm i --legacy-peer-deps
```

If you run `serve` and `build` at the same time, some build tool seems to break its cache. Existing lint/ts errors are not reevaluated and stay reported.

Clearing the cache seems to fix it:

```shell
rm -rf node_modules/.cache
```

**SSR, server with `tsx`**:

```shell
tsx ./packages/demo-server/src/cli.js pointer
tsx --watch ./packages/demo-server/src/server.js
```

Note that it doesn't work when starting `tsx` from within the packages folder or when specifying the packages `tsconfig`, as then it doesn't correctly apply extended tsconfig settings when using other packages. But also `tsx` doesn't seem to honor nested tsconfig and will only use the main, e.g. the `jsx` setting only worked when either specifying the nested tsconfig or when moving the setting to the root tsconfig.

---

**SSR, server with `ts-node`**, *broken monorepo TS-ESM module resolving*:

```shell
npm -w packages/demo-server run serve
npm -w packages/demo-server run cli pointer
```

## Documentation App

**Serve docs for editing:**

After installing deps, minimal startup for docs:

```shell
npm run serve docs

# (re-)create code documentation and search index
npm run static-gen
# npm run doc-gen
# npm run page-index
```

**Serve docs with docker:**

After installing deps, create a minimal build:

```shell
npm run static-gen
npm run build-babel
npm run build-webpack
```

And then build the [DockerfileApache](./DockerfileApache) and open [http://localhost:8080](http://localhost:8080).

In some IDEs, you can build it using the `ui-schema-docs` preset, which is configured in the [.run](./.run) folder. It should appear with a play button somewhere in your IDE's toolbar or run menu.

Or build and run via CLI:

```shell
docker build -f DockerfileApache -t ui-schema-docs .

docker run --rm -p 8080:80 ui-schema-docs
```

## Commands

- Developing test driven: `npm run tdd`
    - needs manual bootstrapping and update handling
    - `npm run tdd -- -u --testPathPattern=src/Validators`
        - with `-u|--update` for snapshot update testing
        - with `--testPathPattern` to run all tests in a specific folder / path
        - `npm run tdd -- --testPathPattern=PatternValidator -t patternValidator` for only one test and often only one file
- Testing: `npm test`
    - needs manual bootstrapping, linking and update handling
- Build: `npm run build`
    - needs manual bootstrapping and update handling
- Clean node_modules and build dirs: `npm run clean`
- Clean build dirs: `npm run clean-dist`
- Start Documentation: `npm run docs`
    - see [localhost:4201](http://localhost:4201)
    - write in [packages/docs/src/content/docs](./packages/docs/src/content/docs)
- Faster start, needs manual bootstrapping and update handling
    - `npm run serve` start all configured apps
    - `npm run serve -- demoWeb --serve docs` start specific apps (docs and demo-web here)

## Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the [MIT License](LICENSE) attached to the repository and to adhere to the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md).

Questions? Feel free to [open discussions](https://github.com/ui-schema/ui-schema/discussions) or join the [discord channel](https://discord.gg/MAjgpwnm36)!
