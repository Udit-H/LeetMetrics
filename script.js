document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }

            const data = await response.json();
            console.log("Logging Data...", data);

            if (data.status == 'error' || data.message?.toLowerCase().includes("does not exist")) {
                throw new Error("User does not exist");
            }

            try {
                displayUserData(data);
            } catch (e) {
                console.error("Error displaying user data:", e);
                statsContainer.innerHTML = `<p>Unable to display user data</p>`;
            }
        }
        catch (error) {
            statsContainer.innerHTML = `<p>No Data Found</p>`
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {
        const totalEasyQues = data.totalEasy;
        const totalMedQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const solvedEasy = data.easySolved;
        const solvedMed = data.mediumSolved;
        const solvedHard = data.hardSolved;

        updateProgress(solvedEasy, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMed, totalMedQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHard, totalHardQues, hardLabel, hardProgressCircle);
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value
        console.log("Login username : ", username);

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    })
})
