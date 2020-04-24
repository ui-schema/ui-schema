const fs = require('fs');
const path = require('path');

const scanner = function(dir, exclude = [], {onDir = () => null, onFile = () => null}, level = 0) {
    fs.readdir(dir, (err, list) => {
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if(stat && stat.isDirectory()) {
                    if(exclude.includes(file)) {
                        return;
                    }
                    onDir(file, level);
                    scanner(file, exclude, {onDir, onFile}, level + 1);
                } else {
                    onFile(file)
                }
            });
        });
    });
};

const fileExists = (path, onExists, onMissing) => {
    fs.stat(path, (err) => {
        if(err == null) {
            onExists();
        } else if(err.code === 'ENOENT') {
            onMissing();
        }
    });
};

/**
 * Puts a package.json into every child directory of root.
 * That package.json contains information about esm for bundlers so that imports
 * like import Typography from '@material-ui/core/Typography' are tree-shakeable.
 *
 * Modified from original: nested folder support
 *
 * @author Material-UI Authors, from: https://github.com/mui-org/material-ui/blob/master/scripts/copy-files.js
 * @licence MIT
 * @param {string} root
 */
exports.createModulePackages = function createModulePackages(root) {
    const actions = [];
    scanner(root, [path.resolve(root, 'esm')], {
        onDir: (dir, level) => {
            actions.push(new Promise(((resolve) => {
                fileExists(
                    path.join(dir, 'index.js'),
                    () => {
                        fs.writeFile(path.join(dir, 'package.json'), JSON.stringify({
                            sideEffects: false,
                            module: path.join('../'.repeat(level + 1) + 'esm', path.basename(dir), 'index.js').replace(/\\/g, '/'),
                            typings: './index.d.ts',
                        }, null, 4), () => {
                            resolve();
                            /* todo: d.ts can only be checked after webpack has run, enable after removed webpack
                            fileExists(
                                path.join(dir, 'index.d.ts'),
                                resolve,
                                () => {
                                    console.warn('#! index.d.ts missing in: ' + dir);
                                    resolve();
                                }
                            );*/
                        })
                    },
                    () => {
                        // todo: switch to errors on `.d.ts` enabled packages
                        console.warn('#! index.js missing in: ' + dir);
                        resolve();
                    }
                )
            })))
        }
    })

    return Promise.all(actions)
}
