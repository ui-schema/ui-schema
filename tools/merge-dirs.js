#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

function copyFile(file, location) {
    fs.mkdirSync(path.dirname(file), {
        mode: 0x1ed,
        recursive: true,
    })
    fs.writeFileSync(file, fs.readFileSync(location))
}

function mergeDirs(src, dest, overwrite = true) {
    const files = fs.readdirSync(src)

    files.forEach((file) => {
        const srcFile = path.join(src, file)
        const destFile = path.join(dest, file)
        const stats = fs.lstatSync(srcFile)

        if(stats.isDirectory()) {
            mergeDirs(srcFile, destFile)
        } else {
            if(overwrite || !fs.existsSync(destFile)) {
                copyFile(destFile, srcFile)
            }
            // skip when not overwrite and file exists
        }
    })
}

const argv = process.argv.slice(2)

const helpString = `Usage: merge-dirs source destination [--overwrite]`
if(argv.length < 2 || argv.includes('--help')) {
    console.log(helpString)
    process.exit()
}

mergeDirs(argv[0], argv[1], argv[2] === '--overwrite')
