const produtosBox = document.getElementById("produtosbox");
const inputID = document.getElementById("inputID");
const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const inputNames = document.getElementById("inputNames");
const inputEmails = document.getElementById("inputEmails");

function ShowNameOptions () 
{
    inputNames.innerHTML = "";
    if(inputName.value.length > 3)
    {
        fetch("/listnames", 
        {
            method: 'post',
            body: JSON.stringify({name:inputName.value}),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(function (data) {
            console.log(data);
            data.forEach(element => {
                inputNames.innerHTML += "<option value='"+element.name+"'/>";
            });
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    }
}

function ShowEmailOptions () 
{
    inputEmails.innerHTML = "";
    if(inputEmail.value.length > 3)
    {
        fetch("/listemails", 
        {
            method: 'post',
            body: JSON.stringify({name:inputEmail.value}),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(function (data) {
            console.log(data);
            data.forEach(element => {
                inputEmails.innerHTML += "<option value='"+element.email+"'/>";
            });
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    }
}

function Consultar () 
{
    let user = 
    {
        id:parseInt(inputID.value),
        name:inputName.value, 
        email:inputEmail.value
    };

    fetch("/search", 
    {
        method: 'post',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        console.log(data);
        produtosBox.innerHTML = "";
        data.forEach(element => {
            produtosBox.innerHTML += "<li><h3>ID: "+element.id+"</h3><h4>Nome: "+element.name+"</h4><h5>Email: "+element.email+"</h5></li>";
        });
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}

/*function Consultar ()
{
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        //console.log(this.responseText);
        if(this.responseText.startsWith("<!DOCTYPE html>")) return;
        const produtosCarregados = JSON.parse(this.responseText);
        produtosBox.innerHTML = "";
        produtosCarregados.forEach(element => {
            produtosBox.innerHTML += "<li>"+element+"</li>";
        });
    }
    const pid = inputID.value;
    //console.log(pid);
    xhttp.open("GET", "/"+ (pid != ""?pid:"all"), true);
    xhttp.send();
}*/

//NameOptions ();
Consultar ();