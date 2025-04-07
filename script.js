window.onload = function () {
    const darkTheme = document.getElementById("dark-theme");
    const lightTheme = document.getElementById("light-theme");
    const savedTheme = localStorage.getItem("theme");
  
  

    if (savedTheme === "light") {
      darkTheme.disabled = true;
      lightTheme.disabled = false;
    }
  
    document.getElementById("themeToggleBtn").onclick = function () {
      const isCurrentlyDark = !darkTheme.disabled;
  
      darkTheme.disabled = isCurrentlyDark;
      lightTheme.disabled = !isCurrentlyDark;
  
      localStorage.setItem("theme", isCurrentlyDark ? "light" : "dark");
    };
  };
 
  

  /////////////////////////////////////////////////////////////////////////


$(document).ready(function () {
    var userSelection;
    var selectedValue = 0;
    $("#gamePlay").hide(); // hide Game Play container
    
    const audio = new Audio("https://cdn.freesound.org/previews/668/668879_10859468-lq.mp3");
   

    $('#play').click(function() {
          if (audio.paused == true) {
               audio.play();
              }
      else {
        audio.pause();
      }
      });



    $(".restartBtn").on('click', function (e) {
        e.preventDefault();
        beginGamePlay();
    });


    // begin button click here
    $("#startGameBtn").on('click', function (e) {
        e.preventDefault();
        $(".column").slideUp("slow");
        beginGamePlay();
    }); // end the button click here

function beginGamePlay (){
   
        audio.play();

        const quizContainer = document.getElementById("quiz");
        const nextButton = document.getElementById("next");
        const prevButton = document.getElementById("prev");
        const restartButton = document.getElementById("restart");
        const scoreContainer = document.getElementById("score");
        const homeBtn = document.getElementById("home");

        let currentQuestionIndex = 0;
        let score = 0;
        let questions = [];

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
            $("#h1").hide();
        }

        //////////////////////////////////////////////////////////////////

     

        async function fetchQuestions() {
            const response = await fetch("https://opentdb.com/api.php?amount=2&type=multiple&category=" + selectedValue);
            const data = await response.json();
            questions = data.results;
            showQuestion();
        }

        function showQuestion() {
            // Game Over
            if (currentQuestionIndex >= questions.length) {
                quizContainer.innerHTML = `<h2>Game Over!</h2><p>Your score: ${score} / ${questions.length}</p>`;
                nextButton.style.display = "none";
                prevButton.style.display = "none";
                restartButton.style.display = "block";
                homeBtn.style.display = "block";
        
                return;
            }
            else
            {
                restartButton.style.display = "none"; 
                homeBtn.style.display = "none"
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


        homeBtn.addEventListener("click", function() {
            window.location.href = "index.html";
            $("#h1").hide();
        });

        prevButton.addEventListener("click", () => {
            currentQuestionIndex--;
            showQuestion();
        });

        fetchQuestions();
    }
}
});
