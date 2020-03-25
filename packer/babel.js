const path = require('path');
const fs = require('fs');
const {spawn} = require('cross-spawn');
const {packagesBabelPlugins, packagesBabelPresets} = require('./webpack.packages');

const spawnBabel = (args) => {
    return spawn(require.resolve('../node_modules/.bin/babel'), args, {stdio: 'inherit'});
};

function buildEsModules(packages, targets = [
    {distSuffix: '', args: ['--env-name', 'cjs']},
    {distSuffix: '/esm', args: []},
]) {
    let babels = [];
    const babelFile = path.join(__dirname, '../', 'babel.config.json');

    return new Promise((resolve, reject) => {
        Object.keys(packages).forEach(pack => {
            babels.push(...targets.map(target => new Promise((resolve, reject) => {
                const entry = packages[pack].entry;
                const dist = path.resolve(packages[pack].root, 'build' + target.distSuffix);

                let args = [entry, ...target.args, '--out-dir', dist];

                if(-1 === process.argv.indexOf('--clean')) {
                    let babelConfig = {
                        presets: packagesBabelPresets,
                        plugins: packagesBabelPlugins,
                    };

                    fs.writeFile(babelFile, JSON.stringify(babelConfig, null, 2), err => {
                        if(err) return console.log(err);

                        let babel = spawnBabel(args);
                        babel.on('exit', code => {
                            if(code !== 0) {
                                reject('Babel transpilation failed: ' + code);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
            })));
        });

        Promise.all(babels)
            .then((e) => {
                if(e.length === babels.length) {
                    console.log('Builded ES6 modules!');
                    fs.unlink(babelFile, unlinkError => {
                        if(unlinkError) {
                            reject(unlinkError);
                        } else {
                            resolve();
                        }
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

exports.buildEsModules = buildEsModules;
