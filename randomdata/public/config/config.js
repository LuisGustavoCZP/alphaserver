const paramsBox = document.getElementById("paramsbox");
const datasBox = document.getElementById("datasbox");
const paramTypes = [];
var paramType; 

function SelectType (evt)
{
    if(paramType != undefined) paramType.classList.remove("selected");
    paramType = evt.target;
    paramType.classList.add("selected");
    //paramTypes.forEach(() => {});
    //console.log(paramType);
    LoadConfigData ();
}

function ChangeData (type, id, txt)
{
    console.log(type);
    if(id == -1){
        console.log("Add novo");
        return;
    }
    fetch("/config/mod", 
    {
        method: 'post',
        body: JSON.stringify({"type":type, "id":id, "value":txt}),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function CreateData (type, txt)
{
    console.log(type);
    fetch("/config/add", 
    {
        method: 'post',
        body: JSON.stringify({"type":type, "value":txt}),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        console.log(data);
        if(data.sucess) LoadConfigData();
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function DeleteData (type, id)
{
    console.log(type);
    fetch("/config/del", 
    {
        method: 'post',
        body: JSON.stringify({"type":type, "id":id}),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        console.log(data);
        if(data.sucess) LoadConfigData();
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function CreateElement (id, txt, value) {
    const l = document.createElement("li");
    const t = document.createElement("input");
    t.value = value;
    t.onchange = evt => {ChangeData(txt, id, evt.target.value)};
    const btn = document.createElement("button");
    if(id == -1){
        btn.innerText = "+";
        btn.onclick = evt => {CreateData(paramType.innerText, t.value)};
    } else {
        btn.innerText = "-";
        btn.onclick = evt => {DeleteData(paramType.innerText, id)};
    }
    l.append(t);
    l.append(btn);
    datasBox.append(l);
    return l;
}

function LoadConfigData ()
{
    fetch("/config/get?paramtype="+paramType.innerText)
    .then((resp) => resp.json())
    .then(function (data) {
        //console.log(data);
        datasBox.innerHTML = "";
        let i = 0;
        CreateElement(-1, paramType.innerText, "");
        data.forEach(element => 
        {
            const id = i++;
            CreateElement(id, paramType.innerText, element);
        });
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function LoadConfig ()
{
    fetch("/config/get")
    .then((resp) => resp.json())
    .then(function (data) {
        //console.log(data);
        paramsBox.innerHTML = "";
        data.forEach(element => {
            const l = document.createElement("li");
            const btn = document.createElement("button");
            btn.innerText = element;
            btn.onclick = SelectType;
            l.append(btn);
            paramsBox.append(l);
            paramTypes.push(btn);
        });
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

LoadConfig ();