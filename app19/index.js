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
            const points = StrangeCompare(pms.name, user.name);
            if(points > .5) p.push(user); // || user.name.includes(pms.name)
            console.log(points);
            return p;
        }, []);
        resultSearch.sort((a, b) => { return StrangeCompare(pms.name, a.name) > StrangeCompare(pms.name, b.name) ? -1 : 1});
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
