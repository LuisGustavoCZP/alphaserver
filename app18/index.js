var express = require('express');
var filesystem = require('fs');
var app = express();

app.use(express.static(__dirname));

function loadData () {
    const data = JSON.parse(filesystem.readFileSync('produtos.json', 'utf-8'));
    return data;
}

/*app.use('/', function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});

app.use('/user/:id', function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});*/

app.get('/all', function (req, res) {
    res.send(loadData().reduce((p, a) => 
    {
        p.push(a.nome);
        return p;
    }, []));
});

app.get('/:produtoid', function (req, res) {
    const pms = req.params;
    const pid = parseInt(pms.produtoid);
    const data = loadData();
    const resultSearch = data.reduce((p, a) => 
    {
        if(pid == a.id) p.push(a.nome);
        return p;
    }, []);
    if(resultSearch.length == 0) {
        res.send("Formato indevido");
    } else {
        res.send(resultSearch);
    }
});

app.listen(3000, function () {
    console.log('Ready')
});
