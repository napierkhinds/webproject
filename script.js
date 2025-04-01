$(document).ready(function () {
    var userSelection;
    var selectedValue = 0;
    $("#gamePlay").hide(); // hide Game Play container

    // begin button click here
    $("#startGameBtn").on('click', function (e) {
        if (!$("input[name='game_category']:checked").val()) {
            // show message if no option selected
            $("#messages").html("Please select an option to continue...");
            return false;
        } else {
            // game begins here
            $("#startGameBtn").hide(); // hide start button when game begins
            $("#messages").html(""); // clear any old messages

            userSelection = $("input[type='radio']:checked").val(); // assign selected value here

            // get correct ID of selection category for the API 
            if (userSelection == "Sports") {
                selectedValue = 21;
            } else if (userSelection == "Geography") {
                selectedValue = 22;
            } else if (userSelection == "Mythology") {
                selectedValue = 20;
            } else {
                selectedValue = 0;
            }

            // if a valid option is selected from the 3 categories show game play
            if (selectedValue != 0) {
                $("#gamePlay").show();
            }

            //////////////////////////////////////////////////////////////////

            const quizContainer = document.getElementById("quiz");
            const nextButton = document.getElementById("next");
            const prevButton = document.getElementById("prev");
            const scoreContainer = document.getElementById("score");
            let currentQuestionIndex = 0;
            let score = 0;
            let questions = [];

            async function fetchQuestions() {
                const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple&category=" + selectedValue);
                const data = await response.json();
                questions = data.results;
                showQuestion();
            }

            function showQuestion() {
                // Game Over
                if (currentQuestionIndex >= questions.length) {
                    quizContainer.innerHTML = `<h2>Game Over!</h2><p>Your score: ${score} / ${questions.length}</p>`;
                    nextButton.style.display = "none";

                    end
                    return;
                }

                const questionData = questions[currentQuestionIndex];
                const answers = [...questionData.incorrect_answers, questionData.correct_answer];
                answers.sort(() => Math.random() - 0.5);

                quizContainer.innerHTML = `
                    <h3>${questionData.question}</h3>
                    ${answers.map(answer => `<button class="answer">${answer}</button>`).join("")}
                `;

                document.querySelectorAll(".answer").forEach(button => {
                    button.addEventListener("click", () => checkAnswer(button, questionData.correct_answer));
                });

                // Adjust prevButton visibility
                prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";
                nextButton.style.display = "none"; // hide next button until answer is clicked
            }

            function checkAnswer(button, correctAnswer) {
                if (button.textContent === correctAnswer) {
                    button.style.backgroundColor = "green";
                    score++;
                } else {
                    button.style.backgroundColor = "red";
                }

                // Disable all answer buttons after selection
                document.querySelectorAll(".answer").forEach(btn => btn.disabled = true);
                scoreContainer.textContent = `Score: ${score}`;
                nextButton.style.display = "block";
            }

            nextButton.addEventListener("click", () => {
                currentQuestionIndex++;
                showQuestion();
            });

            prevButton.addEventListener("click", () => {
                currentQuestionIndex--;
                showQuestion();
            });

            fetchQuestions();
        }
    }); // end the button click here
});
