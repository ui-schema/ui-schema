const path = require('path');
const fs = require('fs');
const {spawn} = require('cross-spawn');
const {babelPlugins, babelPresets} = require('./webpack.packages');

const spawnBabel = (args) => {
    return spawn(require.resolve('../node_modules/.bin/babel'), args, {stdio: 'inherit'});
};

function buildEsModules(packages) {
    let babels = [];
    //const babelFile = path.join(packages[pack].root, '.babelrc.json');
    const babelFile = path.join(__dirname, '../', 'babel.config.json');

    return new Promise((resolve, reject) => {
        Object.keys(packages).forEach(pack => {
            babels.push(new Promise((resolve, reject) => {
                const entry = packages[pack].entry;
                const dist = path.resolve(packages[pack].root, 'es');

                let args = [entry, '--out-dir', dist];

                if(-1 === process.argv.indexOf('--clean')) {
                    let babelConfig = {
                        presets: babelPresets,
                        plugins: babelPlugins,
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
            }));
        });

        Promise.all(babels)
            .then((e) => {
                if(e.length === babels.length) {
                    console.log('Builded ES6 packages!');
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
