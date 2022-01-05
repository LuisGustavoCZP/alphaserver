const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");

function RegisterUser () 
{
    let user = 
    {
        name:inputName.value, 
        email:inputEmail.value
    };

    fetch("/newuser", 
    {
        method: 'post',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        //console.log('Request succeeded with JSON response', data);
        console.log(data);
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
}
