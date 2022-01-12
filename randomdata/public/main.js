const usersQuanty = document.getElementById("quanty");
const usersBox = document.getElementById("userbox");

function PageCreate (isEnabled) 
{
    if(isEnabled)
        window.location.href="/create";
    else 
        window.location.href=window.location.href.replace("/create", "");
}

function PageConfig (isEnabled) 
{
    if(isEnabled)
        window.location.href="/config";
    else 
        window.location.href=window.location.href.replace("/config", "");
}

function CreateList ()
{
    fetch("/create",
    {
        method: 'post',
        body: JSON.stringify({"quanty":usersQuanty.value}),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        console.log(data);
        usersBox.innerHTML = "";
        data.forEach(element => {
            console.log(element);
            usersBox.innerHTML += `<li><h3>${element.name}</h3> <h4>${element.email}</h4></li>`;
        });
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}