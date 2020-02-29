const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

function logStats(stats) {
    process.stdout.write(stats.toString({
        colors: true
    }) + '\n');
}

function serveWebpack(config) {
    if(!config.devServer) {
        console.error('DevServer is not defined!');
        process.exit(1);
    }
    const options = {...config.devServer};
    options.stats = {
        colors: true,
        modules: false,
    }; // or: 'minimal'

    console.log('Starting Webpack Dev-Server...');

    return new Promise((resolve, reject) => {
        const server = new WebpackDevServer(webpack(config), options);

        server.listen(config.devServer.port, 'localhost', function(err) {
            if(err) {
                console.log(err);
                reject(err)
            }
            console.log('WebpackDevServer listening at localhost:' + config.devServer.port);
            resolve();
        });
    });
}

function buildWebpack(config, cb) {
    webpack(config, (err, stats) => {
        if(err) {
            console.error(err.stack || err);
            if(err.details) {
                console.error(err.details);
            }
            process.exit(1);
        }

        if(stats.hasErrors()) {
            logStats(stats);
            console.error('Compilation has errors!');
            process.exit(1);
        } else if(stats.hasWarnings()) {
            logStats(stats);
            console.error('Compilation has warnings!');
            process.exit(1);
        } else {
            logStats(stats);
            if(cb) {
                cb();
            }
        }
    });
}

exports.buildWebpack = buildWebpack;
exports.serveWebpack = serveWebpack;
