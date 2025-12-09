function onFormSubmitted(event) {
    event.preventDefault();

    var body = {
        username: document.getElementById("username-field").value,
        password: document.getElementById("password-field").value
    };

    var request = new XMLHttpRequest();
    request.open("POST", "https://campus.csbe.ch/uek294/api/v1/authenticate");
    request.onload = onRequestLoaded;
    request.send(JSON.stringify(body));
}

function onRequestLoaded(event) {
    if (event.currentTarget.status == 204) {
        alert("Success!");
    }
    else {
        var response = JSON.parse(event.currentTarget.responseText);
        alert(response.error_message);
    }
}

document.getElementById("test-form").addEventListener("submit", onFormSubmitted);