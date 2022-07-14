import { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import process from 'process'

const __dirname = dirname(fileURLToPath(import.meta.url))

let dotenvRes = dotenv.config({
    path: __dirname + '/.env',
})

if (dotenvRes.error) {
    if (dotenvRes.error.message.indexOf('ENOENT:') === 0) {
        dotenvRes = dotenv.config({
            path: dirname(__dirname) + '/.env',
        })
    }
    if (dotenvRes.error) {
        console.error('dotenvRes.error', dotenvRes.error)
        process.exit(1)
    }
}

export default () => {
}
