/**
 * Server for Serving the Build Folder and enabling BrowserRouter
 */
import express from 'express';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express();

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname)));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3030, () => {
    console.log('Server started on port http://localhost:3030');
});
