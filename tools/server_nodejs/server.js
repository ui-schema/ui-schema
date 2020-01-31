/**
 * Server for Serving the Build Folder and enabling BrowserRouter
 */
const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3030, () => {
    console.log('Server started on port http://localhost:3030');
});
