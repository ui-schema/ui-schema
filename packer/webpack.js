const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const WebpackDevServer = require('webpack-dev-server');
const {babelPlugins, babelPresets} = require('./webpack.common');
const {paths, spawnBabel,} = require('../config');

function logStats(stats) {
    process.stdout.write(stats.toString({
        colors: true
    }) + '\n');
}

function startWebpack(config) {
    if(config.devServer) {
        const options = {...config.devServer};
        options.stats = {
            colors: true,
            modules: false,
        }; // or: 'minimal'

        console.log('Starting Webpack Dev-Server...');

        let wbpk = webpack(config);
        const server = new WebpackDevServer(wbpk, options);

        server.listen(config.devServer.port, 'localhost', function(err) {
            if(err) {
                console.log(err);
                return;
            }
            console.log('WebpackDevServer listening at localhost:' + config.devServer.port);
        });
    } else {
        let babels = [];
        Object.keys(paths.packages).forEach(pack => {
            babels.push(new Promise((resolve, reject) => {
                const entry = paths.packages[pack].entry;
                const dist = path.resolve(paths.packages[pack].root, 'es');
                const src = path.resolve(paths.packages[pack].root, 'src');

                let args = [entry, '--out-dir', dist];

                //args.push('--presets=@babel/preset-react');

                if(-1 === process.argv.indexOf('--clean')) {
                    let babelConfig = {
                        presets: babelPresets,
                        plugins: babelPlugins,
                    };

                    //const babelFile = path.join(paths.packages[pack].root, '.babelrc.json');
                    const babelFile = path.join(__dirname, '../', 'babel.config.json');

                    fs.writeFile(babelFile, JSON.stringify(babelConfig, null, 2), err => {
                        if(err) return console.log(err);

                        let babel = spawnBabel(args);
                        babel.on('message', message => {
                            console.log(message);
                        });
                        babel.on('error', error => {
                            console.log('error babel', error);
                        });
                        babel.on('exit', code => {
                            if(code !== 0) {
                                reject('Babel transpilation failed: ' + code);
                            } else {
                                console.log('babel fin pack', entry, 'to', dist);
                                resolve();
                            }
                        });
                    });
                }
            }));
        });

        Promise.all(babels)
            .then((e) => {
                if(e.length === babels.length) {
                    console.log('Builded the ES6 package!');
                    const babelFile = path.join(__dirname, '../', 'babel.config.json');
                    fs.unlink(babelFile, unlinkError => {
                        if(unlinkError) {
                            console.log(unlinkError);
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                process.exit(1);
            });

        console.log('Starting webpack builds');
        webpack(config, (err, stats) => {
            if(err) {
                console.error(err.stack || err);
                if(err.details) {
                    console.error(err.details);
                }
                return;
            }

            if(stats.hasErrors()) {
                logStats(stats);
                throw new Error('Compilation has errors!');
            } else if(stats.hasWarnings()) {
                logStats(stats);
                throw new Error('Compilation has warnings!');
            } else {
                logStats(stats);
            }
        });
    }
}

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
    const raw = Object.keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce(
            (env, key) => {
                env[key] = process.env[key];
                return env;
            },
            {
                // Useful for determining whether we’re running in production mode.
                // Most importantly, it switches React into the correct mode.
                NODE_ENV: process.env.NODE_ENV || 'development',
                // Useful for resolving the correct path to static assets in `public`.
                // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
                // This should only be used as an escape hatch. Normally you would put
                // images into the `src` and `import` them in code to get their paths.
                PUBLIC_URL: publicUrl,
            }
        );
    // Stringify all values so we can feed into Webpack DefinePlugin
    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };

    return {raw, stringified};
}

const isDev = -1 !== process.argv.indexOf('--dev');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// In development, we always serve from the root. This makes config easier.
const publicPath = !isDev
    ? paths.demo.servedPath
    : isDev && '/';

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = !isDev
    ? publicPath.slice(0, -1)
    : isDev && '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

exports.startWebpack = startWebpack;
exports.env = env;
