var express = require('express');
const bodyParser = require('body-parser');
var filesystem = require('fs');
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));

var clientesPath = "data/rusuarios.json"

var clientes = loadUsers();

function loadUsers () {
    return JSON.parse(filesystem.readFileSync(clientesPath, 'utf-8'));
}

function addUser (user) {
    if(user.name == "" | undefined) return;
    if(user.email == "" | undefined) return;
    user.id = clientes.count++;
    clientes.list.push(user);
    filesystem.writeFileSync(clientesPath, JSON.stringify(clientes), 'utf8', function (err) {
        if (err) throw err;
    });
    return user;
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
    if(value == undefined || value == "") return resultSearch;

    resultSearch = resultSearch.reduce((p, user) => 
    {
        const userparam = user[param];
        console.log(userparam);
        if(userparam != undefined && userparam.includes(value)) p.push(user);
        return p;
    }, []);
    resultSearch.sort((a, b) => { return StrangeCompare(value, a[param]) > StrangeCompare(value, b[param]) ? -1 : 1});
    console.log("Search name "+value+" found "+resultSearch.length+" users");
    return resultSearch;
}

app.use(function (req, res, next) {
    console.log(`Request from ${req.ip}`);
    next();
})

app.post('/newuser', function (req, res) {
    const pms = req.body;
    const user = addUser(pms);
    res.json(user);
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
    let resultSearch = searchUsers(clientes.list, "id", pms.id);
    resultSearch = searchUsers(resultSearch, "name", pms.name);
    resultSearch = searchUsers(resultSearch, "email", pms.email);
    res.json(resultSearch);
});

app.post('/listids', function (req, res) {
    res.json(searchUsers(clientes.list, "id", req.body.id));
});

app.post('/listnames', function (req, res) {
    res.json(searchUsers(clientes.list, "name", req.body.name));
});

app.post('/listemails', function (req, res) {
    res.json(searchUsers(clientes.list, "email", req.body.email));
});

app.listen(8000, function () {
    console.log('Ready')
});
