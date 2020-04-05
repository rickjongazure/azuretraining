$(() => { 
    const formElement = document.getElementById("register")

    $('#formcallback').val(window.location.href);

    let  myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        mode: 'no-cors'
      };

    var form = $('#register');
    // form.submit(function(){
    //     processForm($(this))
    //    return false;
    // });

    const processForm = e => {
        let urlencoded = new URLSearchParams();
        urlencoded.append("firstname", $('#firstname').val());
        urlencoded.append("lastname", $('#lastname').val());
        if (e.preventDefault) e.preventDefault();
        requestOptions.body = urlencoded //"{name: 'rick'}"
        fetch('/api/users', requestOptions).then((response) => response.json())
        .then((result) => {
            console.log('Success:', result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
})