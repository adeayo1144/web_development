function getCookie(name) {
    const cookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

console.log(document.cookie);
/*
 * MOVIES.JS
 * Handles:
 * - Loading movies
 * - Adding movies
 * - Movie form
 * - Activity
 * - Counters
 */

/* =====================================================
   API CONFIGURATION
===================================================== */

const API_BASE_URL = "/api/v1";

/* =====================================================
   LOAD MOVIES
===================================================== */

async function loadMovies() {
    try {
        const token = getCookie("access_token");

        console.log("Token exists:", !!token);
        console.log("Token length:", token ? token.length : 0);

        const response = await fetch(`${API_BASE_URL}/movies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to load movies");
        }

        const data = await response.json();

        const movies = Array.isArray(data) ? data : data.movies || [];

        const movieList = document.getElementById("movieList");

        if (!movieList) {
            console.error("movieList element not found.");
            return;
        }

        movieList.innerHTML = "";

        if (movies.length === 0) {
            document
                .getElementById("emptyMovieState")
                ?.classList.remove("hidden");

            updateCounters();
            return;
        }

        document.getElementById("emptyMovieState")?.classList.add("hidden");

        movies.forEach((movie) => {
            createMovieElement(movie);
        });

        updateCounters();
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

/* =====================================================
   CREATE MOVIE ELEMENT
===================================================== */

function createMovieElement(movie) {
    const movieList = document.getElementById("movieList");

    if (!movieList) {
        console.error("movieList element not found.");
        return;
    }

    const li = document.createElement("li");
    const releaseDate = movie.releaseDate || movie.release_date || "";
    const thumbnail = movie.thumbnail || "";

    li.dataset.movieId = movie.id || "";
    li.dataset.title = movie.title || "";
    li.dataset.producer = movie.producer || "";
    li.dataset.releaseDate = releaseDate;
    li.dataset.thumbnail = thumbnail;

    li.className =
        "flex flex-col gap-4 rounded-xl border " +
        "border-gray-200 bg-gray-50 p-4 transition " +
        "hover:border-red-300 hover:bg-red-50 " +
        "sm:flex-row sm:items-center " +
        "sm:justify-between";

    li.innerHTML = `
        <div class="flex items-center gap-4">

            ${
                thumbnail
                    ? `<img src="${escapeHTML(thumbnail)}" alt="${escapeHTML(movie.title)} thumbnail" class="h-16 w-12 shrink-0 rounded-lg object-cover" />`
                    : `<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">🎬</div>`
            }

            <div>

                <h4 class="font-bold text-black">
                    ${escapeHTML(movie.title)}
                </h4>

                <p class="text-sm text-gray-500">
                    Producer: ${escapeHTML(movie.producer)}
                </p>

                <p class="text-xs text-gray-400">
                    Release Date:
                    ${escapeHTML(releaseDate)}
                </p>

            </div>

        </div>

        <div class="flex gap-2">
            <button type="button" onclick="editMovie('${movie.id}')"
                class="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">Edit</button>
            <button type="button" onclick="deleteMovie('${movie.id}')"
                class="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">Delete</button>
        </div>
    `;

    movieList.appendChild(li);
}

function showEditDialog(movie) {
    const dialog = document.getElementById("editMovieDialog");
    const form = document.getElementById("editMovieForm");
    const titleInput = document.getElementById("editMovieTitle");
    const producerInput = document.getElementById("editMovieProducer");
    const releaseDateInput = document.getElementById("editMovieReleaseDate");
    const thumbnailInput = document.getElementById("editMovieThumbnail");
    const preview = document.getElementById("editMoviePreview");

    if (
        !dialog ||
        !form ||
        !titleInput ||
        !producerInput ||
        !releaseDateInput
    ) {
        return;
    }

    form.dataset.movieId = movie.id || "";
    titleInput.value = movie.title || "";
    producerInput.value = movie.producer || "";
    releaseDateInput.value = movie.releaseDate || "";

    if (thumbnailInput) {
        thumbnailInput.value = "";
    }

    if (preview) {
        if (movie.thumbnail) {
            preview.src = movie.thumbnail;
            preview.classList.remove("hidden");
        } else {
            preview.removeAttribute("src");
            preview.classList.add("hidden");
        }
    }

    dialog.classList.remove("hidden");
}

function hideEditDialog() {
    const dialog = document.getElementById("editMovieDialog");
    if (dialog) {
        dialog.classList.add("hidden");
    }
}

function showDeleteDialog(movieId, title) {
    const dialog = document.getElementById("deleteMovieDialog");
    const message = document.getElementById("deleteMovieMessage");
    const confirmButton = document.getElementById("confirmDeleteMovie");

    if (!dialog || !message || !confirmButton) {
        return;
    }

    dialog.dataset.movieId = movieId;
    message.textContent = `Are you sure you want to delete "${title}"?`;
    confirmButton.dataset.movieId = movieId;
    dialog.classList.remove("hidden");
}

function hideDeleteDialog() {
    const dialog = document.getElementById("deleteMovieDialog");
    if (dialog) {
        dialog.classList.add("hidden");
    }
}

async function editMovie(movieId) {
    const movieElement = document.querySelector(`[data-movie-id="${movieId}"]`);

    const movie = {
        id: movieId,
        title:
            movieElement?.dataset.title ||
            movieElement?.querySelector("h4")?.textContent.trim() ||
            "",
        producer:
            movieElement?.dataset.producer ||
            movieElement
                ?.querySelectorAll("p")[0]
                ?.textContent.replace("Producer:", "")
                .trim() ||
            "",
        releaseDate:
            movieElement?.dataset.releaseDate ||
            movieElement
                ?.querySelectorAll("p")[1]
                ?.textContent.replace("Release Date:", "")
                .trim() ||
            "",
        thumbnail: movieElement?.dataset.thumbnail || "",
    };

    showEditDialog(movie);
}

async function submitEditMovie(event) {
    event.preventDefault();

    const form = document.getElementById("editMovieForm");
    const movieId = form?.dataset.movieId;

    if (!movieId) {
        return;
    }

    const titleInput = document.getElementById("editMovieTitle");
    const producerInput = document.getElementById("editMovieProducer");
    const releaseDateInput = document.getElementById("editMovieReleaseDate");
    const thumbnailInput = document.getElementById("editMovieThumbnail");

    const title = titleInput?.value.trim();
    const producer = producerInput?.value.trim();
    const releaseDate = releaseDateInput?.value;

    if (!title || !producer || !releaseDate) {
        alert("Please fill in all movie details.");
        return;
    }

    const token =
        getCookie("access_token") || localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("producer", producer);
    formData.append("release_date", releaseDate);

    if (thumbnailInput?.files[0]) {
        formData.append("thumbnail", thumbnailInput.files[0]);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token || ""}`,
            },
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Could not edit movie");
        }

        hideEditDialog();
        loadMovies();
    } catch (error) {
        console.error("EDIT MOVIE ERROR:", error);
        alert(error.message || "Could not edit movie");
    }
}

async function deleteMovie(movieId) {
    const movieElement = document.querySelector(`[data-movie-id="${movieId}"]`);
    const title =
        movieElement?.dataset.title ||
        movieElement?.querySelector("h4")?.textContent.trim() ||
        "this movie";

    showDeleteDialog(movieId, title);
}

async function confirmDeleteMovie() {
    const deleteDialog = document.getElementById("deleteMovieDialog");
    const movieId = deleteDialog?.dataset.movieId;

    if (!movieId) {
        return;
    }

    const token =
        getCookie("access_token") || localStorage.getItem("access_token");

    try {
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token || ""}` },
            credentials: "include",
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Could not delete movie");
        }

        hideDeleteDialog();
        loadMovies();
    } catch (error) {
        console.error("DELETE MOVIE ERROR:", error);
        alert(error.message || "Could not delete movie");
    }
}

/* =====================================================
   SHOW MOVIE FORM
===================================================== */

function showMovieForm() {
    const form = document.getElementById("movieForm");

    if (!form) {
        console.error("movieForm element not found.");
        return;
    }

    form.classList.remove("hidden");

    const titleInput = document.getElementById("movieTitle");

    if (titleInput) {
        titleInput.focus();
    }
}

/* =====================================================
   HIDE MOVIE FORM
===================================================== */

function hideMovieForm() {
    const form = document.getElementById("movieForm");

    if (!form) {
        return;
    }

    form.classList.add("hidden");
}

/* =====================================================
   ADD MOVIE
===================================================== */

async function addMovie(event) {
    event.preventDefault();

    console.log("Add movie function called");

    /* ---------------------------------------------
       GET FORM VALUES
    --------------------------------------------- */

    const titleInput = document.getElementById("movieTitle");
    const producerInput = document.getElementById("movieProducer");
    const releaseDateInput = document.getElementById("movieReleaseDate");
    const thumbnailInput = document.getElementById("movieThumbnail");
    const user_id =
        getCookie("access_token") || localStorage.getItem("access_token");

    if (!titleInput || !producerInput || !releaseDateInput) {
        console.error("Movie form fields not found.");

        alert("Movie form is not configured correctly.");

        return;
    }

    const title = titleInput.value.trim();

    const producer = producerInput.value.trim();

    const releaseDate = releaseDateInput.value;

    /* ---------------------------------------------
       VALIDATE FORM
    --------------------------------------------- */

    if (!title || !producer || !releaseDate) {
        alert("Please fill in all movie details.");

        return;
    }

    /* ---------------------------------------------
       GET AUTHENTICATION TOKEN
    --------------------------------------------- */

    const token =
        getCookie("access_token") || localStorage.getItem("access_token");

    console.log("Token:", token);

    /* ---------------------------------------------
       SEND MOVIE TO API
    --------------------------------------------- */

    try {
        console.log("Sending movie to API...");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("producer", producer);
        formData.append("release_date", releaseDate);
        formData.append("user_id", token);
        if (thumbnailInput?.files[0]) {
            formData.append("thumbnail", thumbnailInput.files[0]);
        }

        const response = await fetch(`${API_BASE_URL}/movie`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token || ""}`,
            },
            credentials: "include",
            body: formData,
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(
                `Server returned ${response.status} instead of JSON`,
            );
        }

        if (!response.ok) {
            throw new Error(data.message || "Could not add movie");
        }

        console.log(data);
        /* -----------------------------------------
           ADD MOVIE TO UI
        ----------------------------------------- */

        createMovieElement({
            title: title,
            producer: producer,
            releaseDate: releaseDate,
            thumbnail:
                data.thumbnail ||
                (thumbnailInput?.files[0]
                    ? URL.createObjectURL(thumbnailInput.files[0])
                    : null),
        });

        /* -----------------------------------------
           CREATE ACTIVITY
        ----------------------------------------- */

        createActivity(title);

        /* -----------------------------------------
           UPDATE COUNTERS
        ----------------------------------------- */

        updateCounters();

        /* -----------------------------------------
           HIDE EMPTY STATES
        ----------------------------------------- */

        const emptyMovieState = document.getElementById("emptyMovieState");

        const emptyActivityState =
            document.getElementById("emptyActivityState");

        if (emptyMovieState) {
            emptyMovieState.classList.add("hidden");
        }

        if (emptyActivityState) {
            emptyActivityState.classList.add("hidden");
        }

        /* -----------------------------------------
           CLEAR FORM
        ----------------------------------------- */

        titleInput.value = "";

        producerInput.value = "";

        releaseDateInput.value = "";

        if (thumbnailInput) {
            thumbnailInput.value = "";
        }

        /* -----------------------------------------
           HIDE FORM
        ----------------------------------------- */

        hideMovieForm();
    } catch (error) {
        console.error("ADD MOVIE ERROR:", error);

        alert("Could not add movie: " + error.message);
    }
}

/* =====================================================
   CREATE ACTIVITY
===================================================== */

function createActivity(title) {
    const activityList = document.getElementById("activityList");

    if (!activityList) {
        console.error("activityList element not found.");
        return;
    }

    const activity = document.createElement("li");

    activity.className =
        "flex items-center gap-3 rounded-xl " +
        "border border-gray-100 bg-gray-50 p-4";

    activity.innerHTML = `
        <div
            class="flex h-10 w-10 shrink-0
            items-center justify-center rounded-full
            bg-red-100 text-red-600"
        >
            
        </div>

        <div>

            <p class="text-sm font-semibold text-gray-800">
                Added "${escapeHTML(title)}"
            </p>

            <p class="text-xs text-gray-400">
                Just now
            </p>

        </div>
    `;

    activityList.prepend(activity);
}

/* =====================================================
   UPDATE COUNTERS
===================================================== */

function updateCounters() {
    const movieList = document.getElementById("movieList");

    const activityList = document.getElementById("activityList");

    const movieCountElement = document.getElementById("movieCount");

    if (!movieList || !activityList) {
        return;
    }

    const movieCount = movieList.children.length;

    const activityCount = activityList.children.length;

    /* ---------------------------------------------
       MOVIE COUNT
    --------------------------------------------- */

    if (movieCountElement) {
        movieCountElement.textContent =
            movieCount + (movieCount === 1 ? " Movie" : " Movies");
    }

    console.log("Movies:", movieCount);

    console.log("Activities:", activityCount);
}

/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}

/* =====================================================
   INITIALIZE MOVIE FORM
===================================================== */

function initializeMovieForm() {
    const form = document.querySelector("#movieForm form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", addMovie);
}

/* =====================================================
   INITIALIZE PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Movies page initialized.");

    /* -----------------------------------------
           FORM
        ----------------------------------------- */

    const form = document.getElementById("movieFormElement");
    const editForm = document.getElementById("editMovieForm");
    const confirmDeleteButton = document.getElementById("confirmDeleteMovie");

    if (form) {
        form.addEventListener("submit", addMovie);
    } else {
        console.warn("movieFormElement not found.");
    }

    if (editForm) {
        editForm.addEventListener("submit", submitEditMovie);
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener("click", confirmDeleteMovie);
    }

    /* -----------------------------------------
           LOAD MOVIES
        ----------------------------------------- */

    loadMovies();

    /* -----------------------------------------
           UPDATE COUNTERS
        ----------------------------------------- */

    updateCounters();
});
