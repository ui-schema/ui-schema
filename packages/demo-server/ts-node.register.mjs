import { pathToFileURL } from "node:url"
import { register } from "node:module"
import { setUncaughtExceptionCaptureCallback } from "node:process"

register("ts-node/esm", pathToFileURL("./"))

// fix for unserialized ts errors
// e.g.: [Symbol(nodejs.util.inspect.custom)]: [Function: [nodejs.util.inspect.custom]]
// https://github.com/TypeStrong/ts-node/issues/2026#issuecomment-1625385054
setUncaughtExceptionCaptureCallback((err) => {
    console.error('UncaughtException', err)
    process.exit(1)
})
