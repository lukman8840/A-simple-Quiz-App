// Array of quiz data, including questions, multiple-choice answers, and the correct answer

const quizData = [
    {
        question: "Which language runs in a web browser?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "JavaScript",
        correct: "d",
    },
    {
        question: "What does CSS stand for?",
        a: "Central Style Sheets",
        b: "Cascading Style Sheets",
        c: "Cascading Simple Sheets",
        d: "Cars SUVs Sailboats",
        correct: "b",
    },
    {
        question: "What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Hypertext Markdown Language",
        c: "Hyperloop Machine Language",
        d: "Helicopters Terminals Motorboats",
        correct: "a",
    },
    {
        question: "What year was JavaScript launched?",
        a: "1996",
        b: "1995",
        c: "1994",
        d: "none of the above",
        correct: "b",
    },
    {
        question: "Which company developed the React framework?",
        a: "Google",
        b: "Facebook",
        c: "Twitter",
        d: "Microsoft",
        correct: "b",
    },
    {
        question: "Which of the following is not a programming language?",
        a: "HTML",
        b: "Python",
        c: "JavaScript",
        d: "Ruby",
        correct: "a",
    },
    {
        question: "What does SQL stand for?",
        a: "Structured Query Language",
        b: "Strong Question Language",
        c: "Stylish Query Language",
        d: "Structured Query List",
        correct: "a",
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        a: "class",
        b: "style",
        c: "font",
        d: "styles",
        correct: "b",
    },
    {
        question: "What is the correct syntax to link an external JavaScript file?",
        a: "<script src='script.js'></script>",
        b: "<link src='script.js'>",
        c: "<script href='script.js'></script>",
        d: "<script file='script.js'></script>",
        correct: "a",
    },
    {
        question: "In CSS, what does 'float' property do?",
        a: "It arranges elements side by side.",
        b: "It makes the element float above others.",
        c: "It hides the element.",
        d: "It changes the background color.",
        correct: "a",
    },
    {
        question: "Which of the following is a JavaScript framework?",
        a: "Django",
        b: "React",
        c: "Flask",
        d: "Laravel",
        correct: "b",
    },
    {
        question: "Which HTML element is used to define a hyperlink?",
        a: "<a>",
        b: "<link>",
        c: "<href>",
        d: "<nav>",
        correct: "a",
    },
    {
        question: "Which method is used to add an element to the end of an array in JavaScript?",
        a: "push()",
        b: "pop()",
        c: "shift()",
        d: "unshift()",
        correct: "a",
    },
    {
        question: "Which CSS property controls the text size?",
        a: "font-style",
        b: "text-size",
        c: "font-size",
        d: "text-style",
        correct: "c",
    },
    {
        question: "Which of the following is used to write server-side scripts?",
        a: "JavaScript",
        b: "PHP",
        c: "HTML",
        d: "CSS",
        correct: "b",
    },
];

// DOM elements
const quiz = document.getElementById('quiz');
const answer = document.querySelectorAll('.answer');
const question = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const startForm = document.getElementById('start-form');
const usernameInput = document.getElementById('username');
const startContainer = document.getElementById('start-container');
const quizContent = document.getElementById('quiz-content');
const timerElement = document.getElementById('time');
const timerContainer = document.getElementById('timer-container');
const userGreeting = document.querySelector('.user-greeting');
const userNameDisplay = document.getElementById('user-name');

// State variables
let currentQuestionIndex = 0; // Index of the current question
let timer; // Timer for the quiz
let timeLeft = 300; // Time left in seconds
let score = 0; // User's score
let userAnswers = []; // Array to store user's answers
let username = ''; // Username of the user

// Hide the timer initially
timerElement.classList.add('hidden')

// Event listener for form submission to start the quiz
startForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    username = usernameInput.value.trim();
    userNameDisplay.textContent = `Welcome, ${username}!`;

    // Hide the start container and show the quiz content
    startContainer.style.display = 'none';
    userGreeting.style.display = 'block';
    quizContent.style.display = 'block';

    if (username) {
        startQuiz();
    }
});

// Function to start the quiz
function startQuiz() {
    shuffleArray(quizData);
    loadQuiz();
    startTimer();
    timerElement.classList.remove('hidden')
    console.log(`Quiz started for: ${username}`);
}

// Function to load the current question
function loadQuiz() {
    const currentQuizData = quizData[currentQuestionIndex];
    question.innerText = `${currentQuestionIndex + 1}. ${currentQuizData.question}`;
    a_text.innerText = ` (a) ${currentQuizData.a}`;
    b_text.innerText = ` (b) ${currentQuizData.b}`;
    c_text.innerText = ` (c) ${currentQuizData.c}`;
    d_text.innerText = ` (d) ${currentQuizData.d}`;
    
    answer.forEach(radio => radio.checked = false);

 // Preselect the user's previously chosen answer if available
    if(userAnswers[currentQuestionIndex]){
        document.getElementById(userAnswers[currentQuestionIndex]).checked = true;
    }

    updateProgressBar();
}

// Function to update the progress bar based on answered questions
function updateProgressBar(){
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = '';

    quizData.forEach((_, index) => {
        const item = document.createElement('div');
        item.className = 'progress-item';

        // Mark answered and unanswered questions

        if(userAnswers[index] !== undefined){
            item.classList.add('answered');
            item.textContent = index + 1;
        } else {
            item.classList.add('unanswered');
            item.textContent = index + 1;
        }
        progressBar.appendChild(item);
    });
}

// Function to start the timer
function startTimer() {
    timerContainer.classList.remove('hidden');
    timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;

         // End quiz if time runs out
        if (timeLeft < 0) {
            clearInterval(timer);
            calculateScore();
            showResult();
            timerContainer.classList.add('hidden')
            alert('Time is up!');
        }
    }, 1000);
}

// Function to move to the next question
function nextQuestion() {
    saveAnswer(); // Save the current answer before moving
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuiz();
    } else {
        // Handle end of quiz or provide a message
    }
}
// Function to move to the previous question
function prevQuestion() {
    saveAnswer(); // Save the current answer before moving
    currentQuestionIndex--;
    if (currentQuestionIndex >= 0) {
        loadQuiz();
    }
}

// Event listener for the "Next" button
document.querySelector('.next').addEventListener('click', () => {
    if (currentQuestionIndex < quizData.length - 1) {
        nextQuestion();
    } else {
        alert('You are already on the last question!');
    }
});

// Event listener for the "Previous" button
document.querySelector('.prev').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        prevQuestion();
    } else {
        alert('You are already on the first question!');
    }
});

// Function to save the selected answer
function saveAnswer() {
    let selectedAnswer;
    answer.forEach(radio => {
        if (radio.checked) {
            selectedAnswer = radio.id;
        }
    });

    userAnswers[currentQuestionIndex] = selectedAnswer; 
    updateProgressBar();
}
// Function to calculate the final score
function calculateScore() {
    score = 0; 
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
    });
}
// Function to display the result
function showResult() {
    const totalQuestions = quizData.length;
    const percentage = (score / totalQuestions) * 100;

    let feedback = '';

    if (percentage >= 90){
        feedback = `Excellent Performance ${username}`;
    } else if (percentage >= 70){
        feedback = `Good Performance ${username}`;
    } else if (percentage >= 50){
        feedback = `Nice performance ${username}`;
    } else if (percentage >= 40){
        feedback = `Fair Performance ${username}`;
    } else {
        feedback = `Needs Improvement ${username}`;
    }

  // Display the final score and feedback, and provide an option to restart

    quizContent.innerHTML = `
    <h2>${username}, You answered ${score} out of ${quizData.length} questions correctly!</h2>
    <h3>Your Score: ${percentage.toFixed(0)}% Out of 100%</h3>
    <h4>${feedback}</h4>
    <button id="restart" onclick="location.reload()">Take it Again</button>
    `;
    timerContainer.classList.add('hidden')
}

// Function to shuffle an array
function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// Event listener for the "Submit" button
submitBtn.addEventListener('click', () => {
    const unansweredQuestions = quizData.length - userAnswers.filter(answer => answer !== undefined).length;
// Confirm submission if there are unanswered questions
    if (unansweredQuestions > 0){
        const confirmation = confirm(`You have ${unansweredQuestions} not attempted Questions. Do you still want to Submit ?`);

        if (confirmation) { 
            saveAnswer(); 
            calculateScore();
            showResult();
            clearInterval(timer);
            timerContainer.classList.add('hidden'); 
        } else {
            return;
        } 
    } else {
        const confirmation = confirm('Are you sure you want to Submit?');
        if (confirmation) { 
            saveAnswer(); 
            calculateScore();
            showResult();
            clearInterval(timer);
            timerContainer.classList.add('hidden'); 
        } 
    }
});
