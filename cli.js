#!/usr/bin/env node

const { exec } = require('child_process');
const packageJson = require('./package.json'); // Make sure the path to package.json is correct

function executeCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            process.exit(1);
        }
        console.log(stdout);
    });
}

function isPm2Installed() {
    return new Promise((resolve, reject) => {
        exec('pm2 -v', (error, stdout, stderr) => {
            if (error) {
                reject(new Error('PM2 is not installed globally. Please install it by running: npm install -g pm2'));
            } else {
                resolve(true);
            }
        });
    });
}

function showVersion() {
    console.log(`openai-api-status-prober version: ${packageJson.version}`);
}

async function main() {
    const args = process.argv.slice(2);

    // Check for the version flag
    if (args.includes('-v') || args.includes('--version')) {
        showVersion();
        return;
    }

    const command = args[0];

    try {
        await isPm2Installed();

        //TODO refactor this whole cursed file
        switch (command) {
            case 'start':
                executeCommand('pm2 start server.js --name openai-api-status-prober');//TODO handle already running
                break;
            case 'stop':
                executeCommand('pm2 stop openai-api-status-prober'); //TODO: refactor package names, use const
                break;
            case 'detach':
                executeCommand('pm2 delete openai-api-status-prober');
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