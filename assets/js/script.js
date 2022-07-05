   var currentPage = "";


// control showing container 
function showContainer(showContainerId){
    currentPage = showContainerId;
    const containerIds = [
        "start-container",
        "questions-container",
        "submit-container",
        "scores-container",
    ]
    // show containers one by one 
    const hiddenContainerIds =  containerIds.filter(function(id){
        return id !== containerIds;
    });
   
    hiddenContainerIds.forEach(function(id) {
        document.getElementById(id).style.display = "none";
    });

    document.getElementById(showContainerId).style.display = "block";
}

// global run page 
window.addEventListener("load",function(){
    showContainer("start-container");

    // start the quiz , ready to question page 
    const startQuizButton = document.querySelector("#start-quiz-btn");
     startQuizButton.addEventListener("click",function(){
        showContainer("questions-container");
        startQuiz();
    })
   //  if on page first , you can click link to view hight scores
    const viewScores = document.querySelector("#view-scores");
     viewScores.addEventListener("click",function(){
        if(currentPage==="start-container"){
            showScores();
        }
    })

    // add the click event to submit quize 
    const submitButton = document.querySelector("#submit-quiz-btn");
     submitButton.addEventListener("click",function(){
        const nameInput = document.querySelector("#name");
        if(nameInput.value){
            saveScore(nameInput.value, scores);
            showScores();
        }
    })
    // connect the go back button first page  
    const backButton = document.querySelector("#back-btn");
    backButton.addEventListener("click",function(){
        showContainer("start-container");
        timeleft = 75;
        document.getElementById("time").textContent = timeleft;
       // in the first page , the answer is empty . there is no answer so far
        var messages = document.querySelectorAll(".message");
        for(var message of messages){
            message.innerHTML = "";
        }
    });
        // set the clear button to clean all scores . 
    const clearButton = document.querySelector("#clear-btn");
    clearButton.addEventListener("click",function(){
        high_scores = [];
        localStorage.removeItem('high_scores');
        addScoreText()
    });
});

// all questions , choices and answer. 
const questions = [ 
    {
        q: "Which of the following is an advantage of using JavaScript?",
        answers: ["Less server interaction", "  Immediate feedback to the visitors", "Increased interactivity", " All of the above."],
        correctAns : 3,
    },
    {
        q: "How can you get the total number of arguments passed to a function?",
        answers: [" sing args.length property", " Using arguments.length property", "  Both of the above.", "None of the above."],
        correctAns: 1
    },
    {
        q: "Which built-in method calls a function for each element in the array?",
        answers: [" while()", "  loop()", "forEach()", "None of the above."],
        correctAns: 2
    },
    {
        q: "Which of the following function of String object returns the character at the specified index?",
        answers: ["charAt()", "charCodeAt()", " concat()", " indexOf()"],
        correctAns: 0
    },
    {
        q: "Which of the following function of String object is used to match a regular expression against a string?",
        answers: ["concat()", " match()", " search()", "replace()"],
        correctAns: 1
    }
];

var timeleft = 75;
var scores = 0;
// var inQuiz = false;
var timerCheck;
// run the timer 
var startTimer = function(){
    const display = document.getElementById("time");
    
    timerCheck = setInterval(function(){
        display.textContent = timeleft ;
        timeleft--;
        if(timeleft < 0){
            submitQuiz()
        }
    },1000)
}

// set the answer is correct or wrong ,if correct,and socres, if wrong, subtract by 10.
function checkAnswer(qid, choiceId){
    var correct = questions[qid].correctAns;
    if(choiceId == correct){
        var messages = document.querySelectorAll(".message");
        for(var message of messages){
            message.innerHTML = "Correct!";
        }
       scores += 10;
    }else{
        var messages = document.querySelectorAll(".message");
        for(var message of messages){
            message.innerHTML = "Wrong!";
        }
        
        timeleft -= 10;
        if (timeleft<0){
            submitQuiz();
            return;
        }
    }
    // run next question 

    if(qid + 1 < questions.length){
        show_question(qid+1);
    }else{
        submitQuiz();
    }
}

//   put the question into HTML ,
function show_question(qid){
    var questionLabel = document.getElementById("question");
    var questionText = "<p>" + questions[qid].q + "</p>\n<ol>\n"
    
    for(var i=0; i<questions[qid].answers.length; i++){
        questionText += '<li class="question-choice" id="' + i +'">' + questions[qid].answers[i] + "</li>\n";
    }
    questionText += "</ol>\n";
    questionLabel.innerHTML = questionText;
// add the click for all the choice .the user can click anyone 
    var choices = document.querySelectorAll(".question-choice");
    for(var choice of choices){
        choice.addEventListener("click",function(){
            checkAnswer(qid, this.id);
        })
    }
}

// when quiz starts, timer runs ,and scores begin from 0, show answer for every question 
function startQuiz() {
    scores = 0;
    timeleft = 75;
    startTimer();
    show_question(0);
}

// when submit the quiz , timer is off , shows scores.
function submitQuiz(){
    timeleft = 0;
    clearInterval(timerCheck)
    showContainer("submit-container");

    document.querySelector("#score").textContent=scores;

    submitQuiz();
}

let highScoreStr = localStorage.getItem('high_scores');
// if has scores , show scores, if not. show empty.
var highScores = highScoreStr ? JSON.parse(highScoreStr) : [];
// high_scores = [ 
//     {
//         name: "John",
//         score: 80,
//     },
//     {
//         name: "Amy",
//         score: 70,
//     },
//     {
//         name: "Bruce",
//         score: 66,
//     },
// ];



// show the scores from large to small 
function saveScore(name, score){
    var hasAdd = false;
    for (var i = 0; i < highScores.length; i++) {
        if(highScores[i].score<score){
            hasAdd = true;
            highScores.splice(i, 0, {
                "name": name,
                "score": score,
            });
            break;
        }
    }

    if(!hasAdd){
        highScores.push({
            "name": name,
            "score": score,
        });
    }
// storage the scores .
    localStorage.setItem('high_scores', JSON.stringify(highScores));
}
// add the scores to HTML 
function addScoreText(){
    var scoreLabel = document.getElementById("scores");
    var scoreText = "<ol>\n";
    for(var highScore of highScores){
        scoreText += "<li><span>" + highScore.name + "</span>"
            + highScore.score+"</li>\n";
    }
    scoreText += "</ol>\n";
    scoreLabel.innerHTML = scoreText;
}
// show them on the browser 
function showScores(){
    showContainer("scores-container");

    addScoreText();
}