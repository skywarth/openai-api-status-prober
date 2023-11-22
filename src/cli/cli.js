#!/usr/bin/env node

const { execSync,exec } = require('child_process');
const CliUtils = require('./cli-utils');

function executeCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            process.exit(1);
        }
        console.log(stdout);
    });
}

 function main() {

    const cliUtils=new CliUtils();
    const serverPath =  cliUtils.getServerPath();
    const args = process.argv.slice(2);
    const packageName='openai-api-status-prober';

    // Check for the version flag
    if (args.includes('-v') || args.includes('--version')) {
        console.log(`${packageName} version: ${cliUtils.getPackageVersion()}`);
        return;
    }

    const command = args[0];

    try {
        cliUtils.isServingUtilityInstalled();

        //TODO refactor this whole cursed file
        switch (command) {
            case 'env-path':
                console.info(`Env path is: ${cliUtils.getEnvPath()}`)
                break;
            case 'start':
                execSync(`pm2 start ${serverPath} --name ${packageName} --watch`, { stdio: 'inherit' });
                execSync(`pm2 save`);
                console.warn('Also run `pm2 startup`!');
                break;
            case 'stop':
                executeCommand(`pm2 stop ${packageName}`);
                execSync(`pm2 save`);
                break;
            case 'detach':
                executeCommand(`pm2 delete ${packageName}`);
                execSync(`pm2 save`);
                break;
            default:
                console.log(`Unknown command: ${command}`);
                process.exit(1);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main();