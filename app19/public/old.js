const produtosBox = document.getElementById("produtosbox");
function ConsultarXHR ()
{
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        console.log(this.responseText);
        if(this.responseText.startsWith("<!DOCTYPE html>")) return;
        const produtosCarregados = JSON.parse(this.responseText);
        produtosBox.innerHTML = "";
        produtosCarregados.forEach(element => {
            produtosBox.innerHTML += "<li>"+element+"</li>";
        });
    }
    const pid = document.getElementById("produtoid").value;
    console.log(pid);
    xhttp.open("GET", "/"+ (pid != ""?pid:"all"), true);
    xhttp.send();
}

ConsultarXHR ();