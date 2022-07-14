import express from 'express'
import {
    RequestCustomPayload,
} from './lib/routing.js'
import boot from './boot.js'
import onHeaders from 'on-headers'
import { customAlphabet } from 'nanoid'
import HomeHandler from './handler/HomeHandler.js'

boot()

const app = express()

app.use(function corsMiddleware(_req: express.Request, res: express.Response, next: () => void) {
    // using a custom cors middleware, as the `express.cors` isn't CDN compatible (doesn't send headers when not needed)
    res.header('Access-Control-Allow-Origin', '*')
    // todo: add expose-headers
    res.header('Access-Control-Allow-Headers', [
        'Content-Type',
        'Cache-Control',
        'Origin',
        'Accept',
        'Authorization',
        'Audience',
        'X-Cloud-Trace-Context',
        'X-Performance',
    ].join(', '))
    res.header('Access-Control-Expose-Headers', [
        'X-Cloud-Trace-Context',
        'X-Trace-Id',
        'X-Lb-Id',
        'X-Performance',
        'X-Rate-Left-10S',
        'X-Rate-Left-5M',
    ].join(', '))

    next()
})

const nanoTrace = customAlphabet('0123456789abcdefghijklmnopqrstuvwxqzABCDEFGHIJKLMNOPQRSTUVWXQZ', 32)

app.use(function profilerMiddleware(req: express.Request & RequestCustomPayload, res: express.Response, next: () => void) {
    const traceId: string = req.header('X-Trace-Id') || req.header('X-Request-Id') || nanoTrace()
    req.trace = traceId as string
    onHeaders(res, function() {
        if (traceId) {
            res.setHeader('X-Trace-Id', traceId)
        }
        res.removeHeader('X-Powered-By')
    })

    next()
})
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/', HomeHandler)

// caching `3h`
//app.use('/', express.static(__dirname + '/demo', {maxAge: 3600 * 1000 * 3}))

export default app
