const form = document.getElementById("change-password");
const feedback = document.getElementById("feedback");
const button = document.getElementById("submit");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    button.textContent = "Loading...";

    const newPassword = document.getElementById("new_password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (newPassword !== confirmPassword) {
        feedback.innerHTML = `<p style="color:red">Passwords do not match.</p>`;
        button.textContent = "Change Password";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/v1/change-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    new_password: newPassword,
                }),
            },
        );

        const data = await response.json();

        if (response.ok) {
            feedback.innerHTML = `<p style="color:green">${data.message}</p>`;
        } else {
            feedback.innerHTML = `<p style="color:red">${data.message}</p>`;
        }
    } catch (error) {
        feedback.innerHTML = `<p style="color:red">Network error. Try again.</p>`;
        if (data.redirect) {
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1500);
        }
    } finally {
        button.textContent = "Change Password";
    }
});
