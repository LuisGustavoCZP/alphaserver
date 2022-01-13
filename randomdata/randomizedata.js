var express = require('express');
const bodyParser = require('body-parser');
var filesystem = require('fs');
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));

const randomDataPath = 'randomtemplate.json';
const randomData = loadData(randomDataPath);

function loadData (path) {
    return JSON.parse(filesystem.readFileSync(path, 'utf-8'));
}

function RandomizeParam (randUsers, param) 
{
    const ps = randUsers[param];
    const r = ps[parseInt(Math.random() * ps.length)];
    return r;
}

function RandomizeUsers (n) 
{
    const newRandomUsers = [];

    for (let i = 0; i < n; i++) 
    {
        const user = {"name":"","email":"","id":i};
        let param = "malenames";
        if(Math.random() >= .5) {
            param = "femalenames";
        }
        //console.log(param);
        const namesN = 1 + parseInt(Math.random()*1.5);
        for (let j = 0; j < namesN; j++) 
        {
            user.name += RandomizeParam(randomData, param) + " ";
        }
        param = "lastnames";
        //console.log(param);
        const lastnamesN = 1 + parseInt(Math.random()*1.5);
        for (let j = 0; j < lastnamesN; j++) 
        {
            user.name += RandomizeParam(randomData, param);
            if(j == 0) user.name += " ";
        }

        user.email = user.name.toLowerCase().replaceAll(" ", "");
        if(Math.random() >= .33) {
            user.email += "@gmail.com"
        } else if(Math.random() >= .66) {
            user.email += "@hotmail.com"
        } else {
            user.email += "@yahoo.com"
        }

        newRandomUsers.push(user);
    }

    filesystem.writeFileSync('data/rusuarios.json', JSON.stringify(newRandomUsers), 'utf8', function (err) {
        if (err) throw err;
    });

    return newRandomUsers;
}

function addRandomData (param, value) 
{
    let p = randomData[param];
    p.push(p);
    /*filesystem.writeFileSync(randomDataPath, JSON.stringify(randomData), 'utf8', function (err) {
        if (err) throw err;
    });*/
    return user;
}

app.post('/create', function (req, res) {
    const pms = req.body;
    //console.log(pms.quanty);
    const user = RandomizeUsers(pms.quanty);
    res.json(user);
});

app.get('/config/get', function (req, res) {
    const pms = req.query;
    //console.log(pms);
    if(pms.paramtype == undefined || pms.paramtype == "") res.json(Object.keys(randomData));
    else 
    {
        const r = randomData[pms.paramtype];
        //console.log("Found " + pms.paramtype + " -> " + r)
        res.json(r);
    }
});

app.post('/config/mod', function (req, res) {
    const pms = req.body;
    console.log(pms);
    if(pms.type == undefined || pms.id == undefined || pms.value == undefined) res.json({"sucess":false});
    else 
    {
        //console.log(pms);
        randomData[pms.type][pms.id] = pms.value;
        //console.log("Found " + pms.paramtype + " -> " + r)
        res.json({"sucess":true});
    }
});

app.listen(8000, function () {
    console.log('Servidor pronto!');
});

RandomizeUsers(50);