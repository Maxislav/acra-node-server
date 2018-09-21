import * as fs from 'fs';
import * as path from 'path';
import * as dateformat from 'dateformat'

const base = path.join(__dirname, '../report');
export const reportCreate = (appName: string, report: { [key: string]: any }) => {
    let jsonString = '';// req.body
    try {
        jsonString = JSON.stringify(report, null, 4);
    } catch (e) {
        console.warn(e);
    }

    createDir(path.join(base, appName))
        .then((prefix) => {
            return writeFile(prefix, dateformat(new Date(), 'yyyy-mm-dd_HH-MM-ss.l'), jsonString )
        });
};


function createDir(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, status) => {
            if (err && err.code === 'ENOENT') {
                fs.mkdir(path, (err) => {
                    if (err) {
                        console.warn(err);
                        return reject(err);
                    }
                    console.log(`Dir created -> ${path}`);
                    resolve(path);
                });
            } else {
                return resolve(path);
            }
        });
    });
}

function writeFile(prefix: string, name: string, data): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(prefix, name.concat('.json')), data, (err) => {
            if(err){
                return reject(err);
            }
            resolve(true)
        })
    });
}