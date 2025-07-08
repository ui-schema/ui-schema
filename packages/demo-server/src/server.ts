import app from './function.js'
import process from 'node:process'

const server = app.listen(process.env.PORT ?? 4199, () => {
    console.log('server: listening on port ' + (process.env.PORT ?? 4199))
})

const shutdown = function() {
    // clean up your resources here, then exit
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
