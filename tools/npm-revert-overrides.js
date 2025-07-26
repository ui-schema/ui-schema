import {existsSync, renameSync} from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const pkgPath = path.join(projectRoot, 'package.json');
const backupPkgPath = path.join(projectRoot, 'package.json.bak');

if (existsSync(backupPkgPath)) {
    console.log('Reverting package.json from backup...');
    renameSync(backupPkgPath, pkgPath);
    console.log('Successfully reverted package.json.');
} else {
    console.log('No backup file (package.json.bak) found. Nothing to revert.');
}
