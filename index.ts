import { app } from './server/server';
import { reportCreate } from './server/file-system';


app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});

app.post('/acra/:name', (req, res) => {

    const appName = req.params.name;
    const url: string = req.url;
    let query: string = '';

    try {
        query = JSON.stringify(req.query, null, 4)
    }catch (e) {
        console.warn(e)
    }
    let jsonString = '';// req.body
    try{
        jsonString = JSON.stringify(req.body, null, 4)
    }catch (e) {
        console.warn(e)
    }

    reportCreate(appName, req.body)

    console.log(url);
    console.log(query);
    console.log(jsonString);
    res.send('post request to the homepage');
});