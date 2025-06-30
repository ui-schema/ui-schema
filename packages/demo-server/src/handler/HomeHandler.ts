import express from 'express'

const HomeHandler: express.Handler = async (_req, res) => {
    return res.send(`
  <!doctype HTML>
<html lang="en">
<head>
    <title>UI Schema Server</title>
    <style>
        body {
            font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,sans-serif;
            background: #182e35;
            color: #fff;
        }
    </style>
</head>
<body>
    <h1>UI Schema Server</h1>
    <p>See commands folder for CLI examples.</p>
    <ul>
        <li><a href="/preview">React Preview</a></li>
    </ul>
</body>
</html>`)
}

export default HomeHandler
