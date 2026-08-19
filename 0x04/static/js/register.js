form = document.getElementById("register")
feedback = document.getElementById("feedback")
button = document.getElementById("submit")

form.addEventListener("submit", async(event) => {
    event.preventDefault();
    button.textContent = "Loading..."
    firstname = document.getElementById('firstname').value,
    lastname = document.getElementById('lastname').value,
    email = document.getElementById('email').value,
    password = document.getElementById('password').value

    const response = await fetch("http://127.0.0.1:5000/api/v1/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstname:firstname,
            lastname: lastname,
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (response.ok){
        feedback.innerHTML = `<p style="color:green">${data.message}</p>`
        setTimeout(() => {
            window.location.href = `${window.location.origin}/login`;
        }, 3000)
    } else {
        feedback.innerHTML = `<p style="color: red">${data.message}</p>`
    }
    button.textContent = "Register"
    })
   
