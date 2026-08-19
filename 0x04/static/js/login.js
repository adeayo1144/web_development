form = document.getElementById("login")
feedback = document.getElementById('feedback')
button = document.getElementById('submit')

form.addEventListener("submit", async(event) => {
    event.preventDefault();
    button.textContent = "Loading..."
    email = document.getElementById('email')
    password = document.getElementById('password')

    const response = await fetch("http://127.0.0.1:5000/api/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await response.json()
        if (response.ok){
            setTimeout(() => {
                window.location.href = `${window.location.origin}/dashboard`;
                }, 3000)
        } else {
            feedback.innerHTML = `<p style="color: red">${data.message}</p>`
        }
        button.textContent = "Login"
    })
  
