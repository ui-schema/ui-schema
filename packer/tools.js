const fs = require('fs');
const rimraf = require('rimraf');

const delDir = dir => (new Promise(((resolve) => {
    if(fs.existsSync(dir)) {
        console.log('deleting', dir);
        rimraf(dir, () => {
            console.log('deleted', dir);
            resolve();
        });
    } else {
        resolve();
    }
})));

function buildEnv(servedPath) {
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
        ? servedPath
        : isDev && '/';

    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
    const publicUrl = !isDev
        ? publicPath.slice(0, -1)
        : isDev && '';
    // Get environment variables to inject into our app.
    return getClientEnvironment(publicUrl);
}

exports.buildEnv = buildEnv;

exports.delDir = delDir;

const buildExternal = (common) => {
    return 'commonjs ' + common;
};
exports.buildExternal = buildExternal;
