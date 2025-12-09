var fields = document.body.querySelectorAll("input");

function onFormSubmitted(event) {
    event.preventDefault();

    

    var body = [];
    
    for (let i = 0; i < fields.length; i++) {
        body.push(fields[i].value);
    }

    /**let x = document.forms["add-form"]["fnumber"].value;
        if (x == "") {
        alert("Must be filled out");
        return false;
        
    }else {
            alert("something happened")
        }
    */

    var request = new XMLHttpRequest();
    request.open("POST", "api/add.php");
    request.onload = onRequestLoaded;
    request.send(JSON.stringify(body));
}

function onRequestLoaded(event) {
    if (event.currentTarget.status == 200) {
        document.getElementById("result").innerText = event.currentTarget.responseText;
    }
    else {
        alert("An unknown error occurred. Please try again later.");
    }
}

let params = new URLSearchParams(window.location.search);

for (let i = 0; i<fields.length; i++){

    if(params.has("n"+ i)){
        fields[i].value = params.get("n" + i);
    }
}

document.getElementById("add-form").addEventListener("submit", onFormSubmitted);




console.log(window.location.search.substring(1).split("=") [1]);
console.log(window.location.search.substring(1).split("=") [1]);