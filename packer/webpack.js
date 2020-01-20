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

    const server = new WebpackDevServer(webpack(config), options);

    server.listen(config.devServer.port, 'localhost', function(err) {
        if(err) {
            console.log(err);
            return;
        }
        console.log('WebpackDevServer listening at localhost:' + config.devServer.port);
    });
}

function startWebpack(config) {
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

exports.startWebpack = startWebpack;
exports.serveWebpack = serveWebpack;
