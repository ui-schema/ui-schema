import path from 'node:path'
import url from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

let dotenvRes = dotenv.config({
    path: __dirname + '/.env',
})

if (dotenvRes.error) {
    if (dotenvRes.error.message.indexOf('ENOENT:') === 0) {
        dotenvRes = dotenv.config({
            path: path.dirname(__dirname) + '/.env',
        })
    }
}

export default () => {
}
