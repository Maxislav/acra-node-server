import * as fs from 'fs';
import * as path from 'path';

class PP {
    compile(src: string, map?: { [key: string]: string }): string {
        map = map || {};
        return src.replace(/\{.+?\}/g, (r: string) => {
            const k = r.replace(/(\{|\})/g, '');
            return map[k];
        });
    }
}

const templateIndex =
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        body{
         width: 100%;
         margin: 0;
         font-family: Arial, Helvetica, sans-serif;
        }
        .container{
            padding: 0 20px;
        }
        *{
         box-sizing: padding-box;
          margin: 0;
          padding: 0;
        }
        .flex{
           display: flex; 
           margin:  0;
        }
        .flex>*, .cell{
            padding: 10px 20px;
        }
        .row{
         border-bottom: 1px solid gray;
        }
        .row:nth-child(2n){
            background: antiquewhite;
        }
        .row:nth-child(2n+1){
            background: #fff5e4;
        }
       
        .row:hover{
            background: white;
        }
        .key{
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="container">
{content}

</div>
</body>
</html>`;


const base = path.join(__dirname, '../report');
export const dirList = (req, res) => {
    const pp = new PP();

    const fileList: Array<string> = [];

    fs.readdir(base, (err, files) => {
        files.forEach(file => {
            fileList.push(`<a href="/report/${file}">${file}</a>`);
        });
        res.statusCode = 200;
        res.send(pp.compile(templateIndex, {content: fileList.join('')}));
    });
};

export const fileList = (req, res) => {
    const pp = new PP();
    const fileList: Array<string> = [];
    fs.readdir(path.join(base, req.params.appName), (err, files) => {
        if (err) {
            res.statusCode = 500;
            res.send('Internal err');
        } else {
            const rex = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})_(\\d{2})-(\\d{2})-(\\d{2})\\.(\\d{3})")
            files.sort((a: any, b: any) => {
                const matcher1 = a.match(rex);
                const matcher2 = b.match(rex);
                const d1 = new Date(matcher1[1], Number(matcher1[2])-1, matcher1[3], matcher1[4], matcher1[5], matcher1[6], matcher1[7]);
                const d2 = new Date(matcher2[1], Number(matcher2[2])-1, matcher2[3], matcher2[4], matcher2[5], matcher2[6], matcher2[7]);
                return d2.getTime() - d1.getTime();
            });
            files.forEach(file => {
                fileList.push(`<div class="row"><div class="cell"><a href="/report/${req.params.appName}/${file}">${file}</a></div></div>\n`);
            });
            res.statusCode = 200;
            res.send(pp.compile(templateIndex, {content: fileList.join('')}));
        }
    });
};

export const fileJson = (req, res) => {
    let jsonObj = '';
    const pp = new PP();

    fs.readFile(path.join(base, req.params.appName, req.params.fileName), (err, content) => {

        try {
            jsonObj = JSON.parse(content.toString());

            const str = htmlFromJson(jsonObj);


            res.send(pp.compile(templateIndex, {content: str}));
        } catch (e) {
            res.statusCode = 500;
            res.end();
        }

        //res.send(content.toString());
    });

};

const htmlFromArray = (arr: Array<any>): string => {
    const divList = [];

    arr.forEach(item => {
        if (Array.isArray(item)) {
            divList.push(htmlFromArray(item));
        } else if (item instanceof Object) {
            divList.push(htmlFromJson(item));
        } else {
            divList.push(`<div>${item}</div>`);
        }
    });
    return divList.join('');

};

const htmlFromJson = (obj, str?) => {

    str = str || '';


    const divList = [];
    Object.keys(obj).forEach(key => {


        if (Array.isArray(obj[key])) {
            divList.push(
                `<div class="row"><div class="flex">
                    <div>${key}</div>
                    <div>${htmlFromArray(obj[key])}</div>
                </div></div>`
            );
        }
        else if (obj[key] instanceof Object) {
            divList.push(htmlFromJson(obj[key]));
        } else {

            let value = !!obj[key].replace ? obj[key].replace(/\n/g, '</br>') : obj[key];


            divList.push(
                `<div class="row">
                    <div class="flex">
                        <div class="key">
                        ${key}
                        </div>
                        <div class="value">
                        ${value}
                        </div>
                    </div>
                </div>`
            );
        }

    });

    return divList.join('');

};