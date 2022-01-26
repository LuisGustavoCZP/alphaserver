var express = require('express');
const bodyParser = require('body-parser');
var filesystem = require('fs');
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));

var clientesPath = "data/rusuarios.json"
var clientes = loadUsers();

function loadUsers () 
{
    return JSON.parse(filesystem.readFileSync(clientesPath, 'utf-8'));
}

function addUser (user) {
    if(user.name == "" | undefined) return;
    if(user.email == "" | undefined) return;

    if(clientes.free && clientes.free.length > 0)
    {
        user.id = clientes.free.pop();
        //arr.splice(2, 0, "Lene");
    }
    else user.id = clientes.count ? clientes.count++ : clientes.length;

    clientes.push(user);
    /* filesystem.writeFileSync(clientesPath, JSON.stringify(clientes), 'utf8', function (err) {
        if (err) throw err;
    }); */
    return user;
}

function remUser (userid) {
    if(userid == -1 && clientes.length <= 0) return false;

    for (let i = 0; i < clientes.length; i++)
    {
        const user = clientes[i];
        if(user.id == userid)
        {
            clientes.splice(i, 1);

            //console.log(clientes.free);
            if(!clientes.free) clientes.free = [];
            //console.log(clientes.free);
            clientes.free.push(user.id);

            return true;
        }
    }
    
    /* filesystem.writeFileSync(clientesPath, JSON.stringify(clientes), 'utf8', function (err) {
        if (err) throw err;
    }); */
    return false;
}

function StrangeCompare (a, b) {
    let points = 0;
    const aWords = a.split(" ");
    const bWords = b.split(" ");
    if(aWords.length <= bWords.length)
    {
        if(b.includes(a)) points += .5;
        for (let i = 0; i < aWords.length; i++)
        {
            let subpoints = 0;
            const aWord = aWords[i];
            const bWord = bWords[i];

            if(aWord.length <= bWord.length)
            {
                if(bWord.includes(aWord)) subpoints += .25;
                for (let i = 0; i < aWord.length; i++)
                {
                    if(aWord[i] != bWord[i]) continue;
                    subpoints += .75/bWord.length;//1/(1 << (bWord.length-i));
                }
            }
            else if(aWord.length > bWord.length)
            {
                if(aWord.includes(bWord)) subpoints += .25;
                for (let i = 0; i < bWord.length; i++)
                {
                    if(aWord[i] != bWord[i]) continue;
                    subpoints += .75/aWord.length;
                    //subpoints += 1/(1 << (aWord.length-i));
                }
            }
            
            points += subpoints / aWords.length;
        }
    }
    
    return points;
}

function searchUsers (resultSearch, param, value)
{
    if(value == undefined || value == "") return [];
    const vP = value.toString().toLowerCase();
    
    resultSearch = resultSearch.reduce((p, user) => 
    {
        const userparam = user[param].toString();
        //console.log(userparam);
        if(userparam == undefined) return p;
        if(userparam.toLowerCase().includes(vP)) p.push(user);
        return p;
    }, []);
    //resultSearch.sort((a, b) => { return StrangeCompare(value, a[param]) > StrangeCompare(value, b[param]) ? -1 : 1});
    console.log("Search name "+value+" found "+resultSearch.length+" users");
    return resultSearch;
}

app.use(function (req, res, next) {
    console.log(`Request from ${req.ip}`);
    next();
})

app.put('/newuser', function (req, res) {
    const pms = req.body;
    const user = addUser(pms);
    res.json(user);
});

app.delete('/deluser', function (req, res) {
    const pms = req.body;
    const userid = pms["userid"];
    console.log(userid);
    const user = remUser(userid);
    res.send(user);
});

app.get('/all', function (req, res) {
    res.send(clientes.list.reduce((p, a) => 
    {
        p.push(a);
        return p;
    }, []));
});

app.post('/search', function (req, res) {
    const pms = req.body;
    const hasID = pms.id != undefined && pms.id != "", hasName = pms.name != "", hasEmail = pms.email != "";
    let resultSearch = searchUsers(clientes, "id", pms.id);
    if(hasName) resultSearch = searchUsers(hasID ? resultSearch : clientes, "name", pms.name);
    if(hasEmail) resultSearch = searchUsers(hasName ? resultSearch : clientes, "email", pms.email);
    res.json(resultSearch);
});

app.post('/listids', function (req, res) {
    res.json(searchUsers(clientes, "id", req.body.id));
});

app.post('/listnames', function (req, res) {
    res.json(searchUsers(clientes, "name", req.body.name));
});

app.post('/listemails', function (req, res) {
    res.json(searchUsers(clientes, "email", req.body.email));
});

app.listen(8000, function () {
    console.log('Ready')
});
