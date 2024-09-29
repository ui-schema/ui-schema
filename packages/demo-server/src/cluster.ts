import process from 'process'
import cluster from 'cluster'

// node packages/api/build/cluster.js

const cCPUs = 6
if(cluster.isPrimary) {
    // Create a worker for each CPU
    for(let i = 0; i < cCPUs; i++) {
        cluster.fork()
    }
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online.')
    })
    // @ts-ignore
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died.', code, signal)
    })
} else {
    import('./function.js').then(extension => extension.default).then(app => {
        app.listen(process.env.PORT || 4255, () => {
            console.log('server: listening on port ' + (process.env.PORT || 4255))
        })
    })
}

