const form = document.getElementById("forgot-password");
const feedback = document.getElementById("feedback");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    target = event.target;
    email = target.email.value;
    button = target.querySelector('button[type="submit"]');
    button.textContent = "Loading...";

   
    const response = await fetch("http://127.0.0.1:5000/api/v1/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    });

    const data = await response.json();

    if (response.ok) {
        feedback.innerHTML =
            `<p style="color:green">${data.message}</p>`;
        setTimeout(() => {
            window.location.href = `${window.location.origin}/change-password?token=${data.token}`;
        }, 3000);
        
    } else {
        feedback.innerHTML =
            `<p style="color:red">${data.message}</p>`;
    }

    button.textContent = "Submit";
});
