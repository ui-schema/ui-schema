import app from './function.js'
import process from 'process'

const server = app.listen(process.env.PORT || 4199, () => {
    console.log('server: listening on port ' + (process.env.PORT || 4199))
})

const shutdown = function() {
    // todo clean up your resources and shit, then exit
    //      - end in-memory polling in e.g. logger/cacher/que-handler
    console.log('server: closing')
    server.close(() => {
        console.log('server: closed')
        process.exit()
    })
}

process.on('SIGINT', function onSigint() {
    console.log('process received SIGINIT')
    shutdown()
})

process.on('SIGTERM', function onSigterm() {
    console.log('process received SIGTERM')
    shutdown()
})
