/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {
    const dashboardPage = document.getElementById("dashboardPage");
    const moviesPage = document.getElementById("moviesPage");

    if (dashboardPage) {
        dashboardPage.classList.remove("hidden");
    }

    if (moviesPage) {
        moviesPage.classList.add("hidden");
    }

    /* Active navigation */

    const dashboardNav = document.getElementById("dashboardNav");
    const moviesNav = document.getElementById("moviesNav");

    if (dashboardNav) {
        dashboardNav.classList.add("bg-red-600", "text-white");
        dashboardNav.classList.remove("text-gray-300");
    }

    if (moviesNav) {
        moviesNav.classList.remove("bg-red-600", "text-white");
        moviesNav.classList.add("text-gray-300");
    }
}

/* =====================================================
   LOGOUT
===================================================== */

function logout() {
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/login";
}

/* =====================================================
   UPDATE DASHBOARD COUNTERS
===================================================== */

function updateCounters() {
    // Change these values later to come from your backend/API
    const totalMovies = 0;
    const totalActivity = 0;

    const totalMoviesElement = document.getElementById("totalMovies");
    const totalActivityElement = document.getElementById("totalActivity");

    if (totalMoviesElement) {
        totalMoviesElement.textContent = totalMovies;
    }

    if (totalActivityElement) {
        totalActivityElement.textContent = totalActivity;
    }
}

/* =====================================================
   INITIALIZE DASHBOARD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    updateCounters();
});
