const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {paths} = require('../config');

function logStats(stats) {
    process.stdout.write(stats.toString({
        colors: true
    }) + '\n');
}

function startWebpack(config) {
    let wbpk = webpack(config);
    if(config.devServer) {
        const options = {...config.devServer};
        options.stats = {
            colors: true,
            modules: false,
        }; // or: 'minimal'

        console.log('Starting Webpack Dev-Server...');
        const server = new WebpackDevServer(wbpk, options);

        server.listen(config.devServer.port, 'localhost', function(err) {
            if(err) {
                console.log(err);
                return;
            }
            console.log('WebpackDevServer listening at localhost:' + config.devServer.port);
        });
    } else {
        wbpk.run((err, stats) => {
            logStats(stats);
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
