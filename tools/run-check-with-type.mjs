import {promises as fs} from 'fs';
import path from 'path';
import {execSync, spawnSync} from 'child_process';

const [, , type] = process.argv;

if (!['module', 'commonjs'].includes(type)) {
    console.error('Usage: node run-check-with-type.mjs <module|commonjs>');
    process.exit(1);
}

let exitCode = 0;

const baseDir = path.resolve('./tools/demo_env_base');
const tempDir = path.resolve(`./tools/.demo_env_${type}`);
const packagePath = path.join(tempDir, 'package.json');

await fs.rm(tempDir, {recursive: true, force: true});
await fs.cp(baseDir, tempDir, {recursive: true});

const pkg = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
pkg.type = type;
await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2));

console.log(`[run-check-with-type] Running check-type-${type} in temp folder`);

execSync(`mkdirp ${tempDir}/node_modules/@ui-schema && cp -r ./dist/* ${tempDir}/node_modules/@ui-schema`, {
    stdio: 'inherit',
});

execSync(`cd ${tempDir} && npm run check-type-${type}`, {stdio: 'inherit'});

const failScript = `npm run check-type-${type}-fail`;

const expectedErrors = {
    module: /require is not defined in ES module scope/, commonjs: /Cannot use import statement outside a module/,
};

const failResult = spawnSync(failScript, {
    cwd: tempDir,
    shell: true,
    stdio: ['inherit', 'inherit', 'pipe'],
    encoding: 'utf-8',
});

const stderr = failResult.stderr || '';
const expectedError = expectedErrors[type];

if (failResult.status === 0) {
    console.error(`❌ ERROR: '${failScript}' exited 0, but was expected to fail.`);
    console.error(`Actual stderr:\n${stderr}`);
    exitCode = 1;
} else if (!expectedError.test(stderr)) {
    console.error(`❌ ERROR: '${failScript}' failed, but not with the expected message.`);
    console.error(`Expected message to match:\n  ${expectedError.source}`);
    console.error(`Actual stderr:\n${stderr}`);
    exitCode = 1;
} else {
    console.log(`✅ Failed as expected: '${failScript}' with error: ${stderr}`);
}

await fs.rm(tempDir, {recursive: true, force: true});

process.exit(exitCode);
