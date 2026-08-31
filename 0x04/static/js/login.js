const form = document.getElementById("login");
const feedback = document.getElementById("feedback");
const button = document.getElementById("submit");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    button.textContent = "Loading...";

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            feedback.innerHTML = `<p style="color: green">${data.message}</p>`;
            document.cookie = `access_token=${data.token}`;
            setTimeout(() => {
                window.location.href = `${window.location.origin}/dashboard`;
            }, 1000);
        } else {
            feedback.innerHTML = `<p style="color: red">${data.message || "Login failed"}</p>`;
        }
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        feedback.innerHTML = `<p style="color: red">Unable to connect to server.</p>`;
    }

    button.textContent = "Login";
});
