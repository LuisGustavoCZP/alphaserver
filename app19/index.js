var express = require('express');
const bodyParser = require('body-parser');
var filesystem = require('fs');
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));

var clientes = loadUsers();

function loadUsers () {
    return JSON.parse(filesystem.readFileSync('data/usuarios.json', 'utf-8'));
}

function addUser (user) {
    user.id = clientes.count++;
    clientes.list.push(user);
    filesystem.writeFileSync('data/usuarios.json', JSON.stringify(clientes), 'utf8', function (err) {
        if (err) throw err;
    });
    return user;
}

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
    let resultSearch = clientes.list;
    if(pms.id != undefined) 
    {
        resultSearch = resultSearch.reduce((p, user) => 
        {
            if(pms.id == user.id) p.push(user);
            return p;
        }, []);
        console.log("Search id "+pms.id+" found "+resultSearch.length+" users");
    }
    if(pms.name != undefined && pms.name != "") 
    {
        resultSearch = resultSearch.reduce((p, user) => 
        {
            if(user.name.includes(pms.name)) p.push(user);
            return p;
        }, []);
        console.log("Search name "+pms.name+" found "+resultSearch.length+" users");
    }
    if(pms.email != undefined && pms.email != "") 
    {
        resultSearch = resultSearch.reduce((p, user) => 
        {
            if(user.email.includes(pms.email)) p.push(user);
            return p;
        }, []);
        console.log("Search email "+pms.email+" found "+resultSearch.length+" users");
    }
    
    res.json(resultSearch);
});

app.post('/listnames', function (req, res) {
    const pms = req.body;
    let resultSearch = clientes.list;
    if(pms.name != undefined && pms.name != "") 
    {
        resultSearch = resultSearch.reduce((p, user) => 
        {
            if(user.name.includes(pms.name)) p.push(user);
            return p;
        }, []);
        console.log("Search name "+pms.name+" found "+resultSearch.length+" users");
    }
    if(resultSearch.length == 0) {
        res.json([]);
    } else {
        res.json(resultSearch);
    }
});

app.post('/listemails', function (req, res) {
    const pms = req.body;
    let resultSearch = clientes.list;
    if(pms.email != undefined && pms.email != "") 
    {
        resultSearch = resultSearch.reduce((p, user) => 
        {
            if(user.email.includes(pms.email)) p.push(user);
            return p;
        }, []);
        console.log("Search email "+pms.email+" found "+resultSearch.length+" users");
    }
    if(resultSearch.length == 0) {
        res.json([]);
    } else {
        res.json(resultSearch);
    }
});

app.listen(3000, function () {
    console.log('Ready')
});
