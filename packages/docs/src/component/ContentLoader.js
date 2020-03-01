const loadedFiles = {};

const contentLoader = (file, cb) => {
    if(loadedFiles[file]) {
        cb(loadedFiles[file], 200);
        return;
    }
    try {
        import('../content/' + file)
            .then(data => {
                fetch(data.default)
                    .then(response => response.text())
                    .then(text => {
                        loadedFiles[file] = text;
                        cb(text, 200);
                    })
                    .catch((e) => {
                        console.error(e)
                        cb(null, 404);
                    });
            })
            .catch((e) => {
                console.error(e)
                cb(null, 404);
            });
    } catch(e) {
        cb(null, 404);
    }
};

export {contentLoader}
