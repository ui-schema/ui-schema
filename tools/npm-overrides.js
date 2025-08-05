import {readFileSync, writeFileSync, existsSync, copyFileSync} from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const pkgPath = path.join(projectRoot, 'package.json');
const backupPkgPath = path.join(projectRoot, 'package.json.bak');

if (!existsSync(backupPkgPath)) {
    console.log('Creating backup: package.json -> package.json.bak');
    copyFileSync(pkgPath, backupPkgPath);
} else {
    console.log('Backup file package.json.bak already exists. Skipping backup.');
}

const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    if (key && value) {
        acc[key] = value;
    }
    return acc;
}, {});

const {
    react: reactVersion,
    mui: muiVersion,
} = args;

if (!reactVersion || !muiVersion) {
    console.error('Error: Missing required arguments.');
    console.error('Usage: node tools/npm-overrides.js react=<version> mui=<version>');
    process.exit(1);
}

console.log(`Applying overrides for: React ${reactVersion}, MUI ${muiVersion}`);

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

pkg.overrides = {
    ...pkg.overrides,
    'react': `^${reactVersion}`,
    'react-dom': `^${reactVersion}`,
    '@types/react': `^${reactVersion}`,
    '@types/react-dom': `^${reactVersion}`,
    '@mui/material': `^${muiVersion}`,
    '@mui/icons-material': `^${muiVersion}`,
};

if (muiVersion.startsWith('5')) {
    pkg.overrides['@mui/lab'] = '^5.0.0-alpha.177';
} else if (muiVersion.startsWith('6')) {
    pkg.overrides['@mui/lab'] = '^6.0.1-beta.36';
} else if (muiVersion.startsWith('7')) {
    pkg.overrides['@mui/lab'] = '^7.0.0-beta.14';
} else {
    delete pkg.overrides['@mui/lab'];
}

for (const k in pkg.overrides) {
    if (pkg.devDependencies?.[k]) {
        delete pkg.devDependencies[k];
    }
    if (pkg.dependencies?.[k]) {
        delete pkg.dependencies[k];
    }
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('Successfully updated package.json with overrides:', pkg.overrides);
