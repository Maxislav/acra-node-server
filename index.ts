import { app } from './server/server';
import { reportCreate } from './server/file-system';
import { dirList, fileJson, fileList } from './server/file-list';
import * as dateformat from 'dateformat'


app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});

app.get('/report', dirList);
app.get('/report/:appName', fileList);
app.get('/report/:appName/:fileName', fileJson);

app.post('/acra/:name', (req, res) => {

    const appName = req.params.name;
    const url: string = req.url;
    let query: string = '';

    try {
        query = JSON.stringify(req.query, null, 4);
    } catch (e) {
        console.warn(e);
    }
    let jsonString = '';// req.body
    try {
        jsonString = JSON.stringify(req.body, null, 4);
    } catch (e) {
        console.warn(e);
    }

    reportCreate(appName, req.body);

    console.log(url);
    console.log(`${dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss' )} PHONE_MODEL -> ${req.body.PHONE_MODEL}`);
    console.log(`*****`);
    res.send('ok');
});