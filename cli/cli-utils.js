
const packageJson = require('../package.json'); // Make sure the path to package.json is correct
const path = require('path');

class CliUtils{

    static #instance;

    constructor() {//Singleton
        if(this.constructor.#instance){
            return this.constructor.#instance;
        }

        this.constructor.#instance=this;
    }

    isServingUtilityInstalled() {
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

    getPackageVersion() {
        return packageJson.version;
    }

    getAppRoot() {

        return path.join(__dirname, "../")
    }

    getServerPath() {
        /*// Use NPM to get the path of the global node_modules directory
        const globalNodeModules = execSync('npm root -g').toString().trim();
        // Construct the path to where the server.js file should be located
        return path.join(globalNodeModules, 'openai-api-status-prober', 'server.js');*/
        const relativePathToServer = './server.js';
        const appRoot=this.getAppRoot();
        return  path.join(appRoot, relativePathToServer);
    }

    getEnvPath() {
        const relativePathToServer = './.env';
        const appRoot=this.getAppRoot();
        return path.join(appRoot, relativePathToServer);
    }

}

module.exports=CliUtils;