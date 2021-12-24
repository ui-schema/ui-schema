# Contributing to UI-Schema

1. Fork/Clone Repository, use branch `develop`
2. Install root dev-dependencies (like lerna, webpack): `npm i`
3. Install `packages` dependencies: `npm run bootstrap`
4. Start dev-server: `npm start`
    - (will clean-dist + linking packages + starting demo app)
    - `npm start -- --serve docs` also starts docs app
5. Open browser on [localhost:4200](http://localhost:4200) for demo, [localhost:4201](http://localhost:4201) for docs
6. Explore [packages](packages)
7. Code -> Commit -> Pull Request -> Being Awesome!

Changes from any package are reflected inside the demo/docs package.

See current *[packages/demo@master](https://ui-schema-demo.netlify.app/)* or
*[packages/demo@develop](https://develop--ui-schema-demo.netlify.app/)*

- Start Documentation: `npm run docs` (needs bootstrap/linking packages beforehand)
    - see [localhost:4201](http://localhost:4201)
    - write in [packages/docs/src/content/docs](./packages/docs/src/content/docs)
- Faster start, needs manual bootstrapping, hoisting and update handling
    - `npm run serve` start all configured apps
    - `npm run serve -- demo --serve docs` start specific apps (docs and demo here)

Commands:

- Developing test driven: `npm run tdd`
    - needs manual bootstrapping, hoisting and update handling
    - `npm run tdd -- -u --testPathPattern=src/Validators`
        - with `-u|--update` for snapshot update testing
        - with `--testPathPattern` to run all tests in a specific folder / path
        - `npm run tdd -- --testPathPattern=PatternValidator -t patternValidator` for only one test and often only one file
- Testing: `npm test`
    - needs manual bootstrapping, hoisting and update handling
- Build: `npm run build`
    - needs manual bootstrapping and update handling
- Clean node_modules and build dirs: `npm run clean`
- Clean build dirs: `npm run clean-dist`
- Add new node_module to one package: `lerna add <npm-package-name> --scope=@ui-schema/demo [--dev] [--peer]`, without `--scope` in all packages
- Do not change `package.json` of packages manually, and if Bootstrap [lerna](https://lerna.js.org/): `npm run bootstrap` (maybe delet e `package-lock.json`), or simply open an issue
- Add new package `lerna create <name>` and follow on screen, e.g.: `lerna create material-pickers` add package name `@ui-schema/material-pickerss`, creates folder `./packages/material-pickers`

Publish, for main-repo only:

1. Manual `lerna version <semver> --no-git-tag-version` is needed
    - like `lerna version 0.0.2 --no-git-tag-version`, see [docs](https://github.com/lerna/lerna/tree/master/commands/version#lifecycle-scripts)
2. Then tag the commit with the same version
3. Push, CI will publish to npm using `npm run release -- --yes`
    - this leads to: `lerna publish from-package --no-git-reset --yes`
4. **todo:** automate version bump by git-tags w/ publish, and switch to independent lerna versioning

Templates for monorepo packages:

- [Additional DS Module](./tools/template-package)
- [Design-System](./tools/template-ds)

## Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the [MIT License](LICENSE) attached to the repository and to adhere to the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md).

Questions? Feel free to open discussions or join the [slack channel](https://join.slack.com/t/ui-schema/shared_invite/zt-smbsybk5-dFIRLEPCJerzDwtycaA71w)!
