const paramsBox = document.getElementById("paramsbox");
const datasBox = document.getElementById("datasbox");
const inputID = document.getElementById("inputID");
const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const inputNames = document.getElementById("inputNames");
const inputEmails = document.getElementById("inputEmails");

var consultTimer;

function RefreshOptions (input, callback) 
{
    if(consultTimer != undefined) 
    {
        console.log("Refresh Timer");
        clearTimeout(consultTimer);
        consultTimer = undefined;
    }
    if(input.value.length <= 3) return;

    console.log("Criando Timer");
    consultTimer = setTimeout(() => {console.log("Executando Timer"); callback (input);}, 2000);
}

function MakeSearch(search, input, callback) 
{
    fetch(search.route, 
    {
        method: 'post',
        body: search.param != undefined ? JSON.stringify({[search.param]:input.value}) : JSON.stringify({"param":input.value}),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(data => {callback(data, input, search.param);})
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function ShowSearchResults (data, input, param, select) 
{
    const text = input.value;
    select.innerHTML = "";
    console.log(data);
    if(data.length > 0) select.innerHTML += `<option onclick="SubmitSelect (${select.id}, ${input.id})" value="${text}">${text}</option>`;
    data.forEach(element => 
    {
        if(text != element[param]) 
        {
            select.innerHTML += `<option onclick="SubmitSelect (${select.id}, ${input.id})" value="${element[param]}">${element[param]}</option>`;
        }
    });
    select.size = select.length;
    select.classList.add("show");
    select.focus();
}

function ShowNames (input) 
{
    MakeSearch({route:"/listnames", param:"name"}, input, (data, ipt, param) => {ShowSearchResults(data, ipt, param, inputNames)});
}

function ShowEmails (input) 
{
    MakeSearch({route:"/listemails", param:"email"}, input, (data, ipt, param) => {ShowSearchResults(data, ipt, param, inputEmails)});
}

function SubmitSelect (select, input)
{
    select.size = 0;
    select.classList.remove("show");
    input.value = select.value;
}

function LoadConfig ()
{
    fetch("/config/get")
    .then((resp) => resp.json())
    .then(function (data) {
        console.log(data);
        paramsBox.innerHTML = "";
        data.forEach(element => {
            paramsBox.innerHTML += `<li><button>${element}</button></li>`;
        });
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function SaveConfig () 
{
    let user = 
    {
        id:parseInt(inputID.value),
        name:inputName.value, 
        email:inputEmail.value
    };

    fetch("/saveconfigs", 
    {
        method: 'post',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        console.log(data);
        paramsBox.innerHTML = "";
        data.forEach(element => {
            paramsBox.innerHTML += `<li><input type="text" value="${element}" /></li>`;
        });
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

function Voltar ()
{
    window.location.href=window.location.href.replace("/consulta", "");
}

LoadConfig ();
//Consultar ();