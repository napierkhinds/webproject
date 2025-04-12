// Wait until the window finishes loading
window.onload = function () {
    const darkTheme = document.getElementById("dark-theme");   // Reference to dark theme stylesheet
    const lightTheme = document.getElementById("light-theme"); // Reference to light theme stylesheet
    const savedTheme = localStorage.getItem("theme");          // Retrieve saved theme from local storage

    // If previously saved theme is light, apply it
    if (savedTheme === "light") {
        darkTheme.disabled = true;
        lightTheme.disabled = false;
    }

    // Handle theme toggle button click
    document.getElementById("themeToggleBtn").onclick = function () {
        const isCurrentlyDark = !darkTheme.disabled;

        // Toggle between dark and light themes
        darkTheme.disabled = isCurrentlyDark;
        lightTheme.disabled = !isCurrentlyDark;

        // Save the current theme setting to local storage
        localStorage.setItem("theme", isCurrentlyDark ? "light" : "dark");
    };
};



/////////////////////////////////////////////////////////////////////////

// Wait for DOM to be fully loaded
$(document).ready(function () {
    var userSelection;        // Stores the user’s selected category name
    var selectedValue = 0;    // Category ID for the API
    $("#gamePlay").hide();    // Hide the quiz container initially

    // Load and prepare background music
    const audio = new Audio("https://cdn.freesound.org/previews/668/668879_10859468-lq.mp3");

    // Play or pause music when #play button is clicked
    $('#play').click(function () {
        if (audio.paused == true) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    // Restart the game when restart button is clicked
    $(".restartBtn").on('click', function (e) {
        e.preventDefault();
        beginGamePlay();
    });

    // Start the game when start button is clicked
    $("#startGameBtn").on('click', function (e) {
        e.preventDefault();
        $(".column").slideUp("slow");  // Hide category selection section
        beginGamePlay();               // Start quiz logic
    });

    // Main game logic begins here
    function beginGamePlay() {
        audio.play(); // Start background music

        const quizContainer = document.getElementById("quiz");
        const nextButton = document.getElementById("next");
        const prevButton = document.getElementById("prev");
        const restartButton = document.getElementById("restart");
        const scoreContainer = document.getElementById("score");
        const homeBtn = document.getElementById("home");

        let currentQuestionIndex = 0;
        let score = 0;
        let questions = [];

        // Check if a category is selected
        if (!$("input[name='game_category']:checked").val()) {
            $("#messages").html("Please select an option to continue...");
            return false;
        } else {
            $("#startGameBtn").hide();         // Hide start button
            $("#messages").html("");           // Clear any messages
            userSelection = $("input[type='radio']:checked").val(); // Get selected value

            // Match selected category with appropriate API ID
            if (userSelection == "Sports") {
                selectedValue = 21;
            } else if (userSelection == "Geography") {
                selectedValue = 22;
            } else if (userSelection == "Mythology") {
                selectedValue = 20;
            } else {
                selectedValue = 0;
            }

            // If a valid category was chosen, start game
            if (selectedValue != 0) {
                $("#gamePlay").show(); // Reveal game area
                $("#h1").hide();       // Hide header/title if necessary
            }

            // Fetch trivia questions from API
            async function fetchQuestions() {
                const response = await fetch("https://opentdb.com/api.php?amount=2&type=multiple&category=" + selectedValue);
                const data = await response.json();
                questions = data.results;
                showQuestion();
            }

            // Display current question
            function showQuestion() {
                // End game if all questions have been answered
                if (currentQuestionIndex >= questions.length) {
                    quizContainer.innerHTML = `<h2>Game Over!</h2><p>Your score: ${score} / ${questions.length}</p>`;
                    nextButton.style.display = "none";
                    prevButton.style.display = "none";
                    restartButton.style.display = "block";
                    homeBtn.style.display = "block";
                    return;
                } else {
                    restartButton.style.display = "none";
                    homeBtn.style.display = "none";
                }

                const questionData = questions[currentQuestionIndex];
                const answers = [...questionData.incorrect_answers, questionData.correct_answer];
                answers.sort(() => Math.random() - 0.5); // Shuffle answers

                // Render question and answer buttons
                quizContainer.innerHTML = `
                    <h3>${questionData.question}</h3>
                    ${answers.map(answer => `<button class="answer">${answer}</button>`).join("")}
                `;

                // Set click handler for each answer button
                document.querySelectorAll(".answer").forEach(button => {
                    button.addEventListener("click", () => checkAnswer(button, questionData.correct_answer));
                });

                // Show prev button only if not on the first question
                prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";
                nextButton.style.display = "none"; // Hide next until user selects an answer
            }

            // Handle answer selection
            function checkAnswer(button, correctAnswer) {
                if (button.textContent === correctAnswer) {
                    button.style.backgroundColor = "green";
                    score++;
                } else {
                    button.style.backgroundColor = "red";
                }

                // Disable all answers after selection
                document.querySelectorAll(".answer").forEach(btn => btn.disabled = true);
                scoreContainer.textContent = `Score: ${score}`;
                nextButton.style.display = "block";
            }

            // Go to next question
            nextButton.addEventListener("click", () => {
                currentQuestionIndex++;
                showQuestion();
            });

            // Return to home
            homeBtn.addEventListener("click", function () {
                window.location.href = "index.html";
                $("#h1").hide();
            });

            // Go to previous question
            prevButton.addEventListener("click", () => {
                currentQuestionIndex--;
                showQuestion();
            });

            // Initial question load
            fetchQuestions();
        }
    }
});
