import { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

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
}

export default () => {
}
