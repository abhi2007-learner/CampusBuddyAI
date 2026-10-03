async function askBuddy() {

    const question = document.getElementById("question").value.trim();
    const answerBox = document.getElementById("answer");

    if (!question) {
        answerBox.innerHTML = `
            <div class="empty-answer">
                <div class="empty-icon">🌷</div>
                <p>Please ask me something first!</p>
                <span>I'm waiting for your question 💕</span>
            </div>
        `;
        return;
    }

    // Show loading state
    answerBox.innerHTML = `
        <div class="empty-answer">
            <div class="empty-icon">🤔</div>
            <p>Buddy is thinking...</p>
            <span>Preparing your answer ✨</span>
        </div>
    `;

    try {

        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        // Show AI response
        answerBox.innerHTML = `
            <div class="ai-response">
                ${formatAnswer(data.answer)}
            </div>
        `;

    } catch (error) {

        answerBox.innerHTML = `
            <div class="empty-answer">
                <div class="empty-icon">🥺</div>
                <p>Oops! Something went wrong.</p>
                <span>Please try asking again.</span>
            </div>
        `;

        console.error(error);
    }
}


/* Make basic formatting readable */
function formatAnswer(text) {

    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}
// ================================
// STUDY PLANNER
// ================================

function openPlanner() {

    document.getElementById("plannerModal").style.display = "flex";

}


function closePlanner() {

    document.getElementById("plannerModal").style.display = "none";

}


async function generatePlan() {

    const subject = document.getElementById("plannerSubject").value.trim();
    const days = document.getElementById("plannerDays").value;
    const topics = document.getElementById("plannerTopics").value.trim();
    const hours = document.getElementById("plannerHours").value;

    const result = document.getElementById("plannerResult");


    if (!subject || !days || !topics || !hours) {

        result.style.display = "block";

        result.innerHTML = `
            <strong>🌷 Almost there!</strong><br><br>
            Please fill in all the details so Buddy can
            create your study plan.
        `;

        return;
    }


    result.style.display = "block";

    result.innerHTML = `
        <div class="empty-answer">
            <div class="empty-icon">🤔</div>
            <p>Buddy is creating your plan...</p>
            <span>Making it fit your study time ✨</span>
        </div>
    `;


    const prompt = `
You are Campus Buddy, a friendly AI study companion.

Create a practical and realistic study plan for a college student.

Subject: ${subject}
Days available: ${days}
Topics to cover: ${topics}
Study hours per day: ${hours}

Make a day-by-day study plan.

For each day include:
- Topics to study
- Suggested study time
- A short practice/revision task

Keep the explanation simple and encouraging.
End with 3 useful exam preparation tips.
`;


    try {

        const response = await fetch("/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: prompt
            })

        });


        const data = await response.json();


        result.innerHTML = `
            <strong>🌸 Your Personalized Study Plan</strong>
            <br><br>
            ${formatAnswer(data.answer)}
        `;


    } catch (error) {

        result.innerHTML = `
            <strong>🥺 Something went wrong.</strong>
            <br><br>
            Please try creating your plan again.
        `;

        console.error(error);

    }

}
// ================================
// PRACTICE CHALLENGE
// ================================

function openPractice() {

    document.getElementById("practiceModal").style.display = "flex";

}


function closePractice() {

    document.getElementById("practiceModal").style.display = "none";

}


async function generatePractice() {

    const subject = document.getElementById("practiceSubject").value.trim();
    const topic = document.getElementById("practiceTopic").value.trim();
    const numberOfQuestions =
        document.getElementById("practiceQuestions").value;

    const result = document.getElementById("practiceResult");


    if (!subject || !topic || !numberOfQuestions) {

        result.style.display = "block";

        result.innerHTML = `
            <strong>🌷 Almost there!</strong><br><br>
            Please fill in all the details first.
        `;

        return;
    }


    result.style.display = "block";

    result.innerHTML = `
        <div class="empty-answer">
            <div class="empty-icon">🤔</div>
            <p>Buddy is preparing your challenge...</p>
            <span>Creating questions for you ✨</span>
        </div>
    `;


    const prompt = `
You are Campus Buddy, a friendly AI study companion.

Create a practice challenge for a college student.

Subject: ${subject}
Topic: ${topic}
Number of questions: ${numberOfQuestions}

Generate exactly ${numberOfQuestions} questions.

Mix conceptual and practical questions where appropriate.

After all questions, provide a clearly separated answer section
with the correct answer for each question.

Keep the difficulty suitable for a college student preparing
for an exam.

Use simple and clear language.
`;


    try {

        const response = await fetch("/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: prompt
            })

        });


        const data = await response.json();


        result.innerHTML = `
            <strong>📝 Your Practice Challenge</strong>
            <br><br>
            ${formatAnswer(data.answer)}
        `;


    } catch (error) {

        result.innerHTML = `
            <strong>🥺 Something went wrong.</strong>
            <br><br>
            Please try again.
        `;

        console.error(error);

    }

}
// ================================
// CGPA CALCULATOR
// ================================

function openCGPA() {

    document.getElementById("cgpaModal").style.display = "flex";

}


function closeCGPA() {

    document.getElementById("cgpaModal").style.display = "none";

}


function calculateCGPA() {

    const values = [
        document.getElementById("sem1").value,
        document.getElementById("sem2").value,
        document.getElementById("sem3").value,
        document.getElementById("sem4").value
    ];

    const sgpas = values
        .filter(value => value !== "")
        .map(value => Number(value));

    const result = document.getElementById("cgpaResult");


    if (sgpas.length === 0) {

        result.style.display = "block";

        result.innerHTML = `
            <strong>🌷 Enter your SGPA first!</strong>
            <br><br>
            Please enter at least one semester SGPA.
        `;

        return;
    }


    const invalid = sgpas.some(sgpa => sgpa < 0 || sgpa > 10);

    if (invalid) {

        result.style.display = "block";

        result.innerHTML = `
            <strong>⚠️ Invalid SGPA</strong>
            <br><br>
            SGPA should be between 0 and 10.
        `;

        return;
    }


    const total = sgpas.reduce(
        (sum, sgpa) => sum + sgpa,
        0
    );

    const cgpa = total / sgpas.length;


    result.style.display = "block";

   let message = "";

if (cgpa >= 9) {
    message = "🎉 Wow! Congratulations! That's an amazing score. Keep shining!";
} 
else if (cgpa >= 8) {
    message = "🌸 Great job! You're doing really well. Keep it up!";
} 
else if (cgpa >= 7) {
    message = "💪 Good effort! A little more consistency can take you even higher.";
} 
else if (cgpa >= 6) {
    message = "🌱 You're making progress! Keep working hard and you can improve next semester.";
} 
else {
    message = "💕 Don't worry! Every semester is a fresh start. Keep working hard—you've got this!";
}


result.innerHTML = `
    <div style="text-align:center;">

        <div style="font-size:35px;">🎓</div>

        <strong>Your CGPA</strong>

        <div style="
            font-size:42px;
            font-weight:700;
            color:#d487aa;
            margin:10px 0;
        ">
            ${cgpa.toFixed(2)}
        </div>

        <p style="
            margin:10px 0;
            font-weight:600;
            color:#765d70;
        ">
            ${message}
        </p>

        <span>
            Calculated from ${sgpas.length} semester${sgpas.length > 1 ? "s" : ""} 🌸
        </span>

    </div>
`;

}
// ================================
// ASK FROM IMAGE
// ================================

function openImageBuddy() {
    document.getElementById("imageBuddyModal").style.display = "flex";
}

function closeImageBuddy() {
    document.getElementById("imageBuddyModal").style.display = "none";
}

async function askFromImage() {

    const imageInput = document.getElementById("studyImage");
    const question = document.getElementById("imageQuestion").value.trim();
    const result = document.getElementById("imageResult");

    if (!imageInput.files.length) {
        result.style.display = "block";
        result.innerHTML = `
            <strong>🌷 Please upload an image first!</strong>
        `;
        return;
    }

    result.style.display = "block";

    result.innerHTML = `
        <div class="empty-answer">
            <div class="empty-icon">🤔</div>
            <p>Buddy is looking at your image...</p>
            <span>Preparing your explanation ✨</span>
        </div>
    `;

    const file = imageInput.files[0];

    const reader = new FileReader();

    reader.onload = async function () {

        const base64Image = reader.result.split(",")[1];

        try {

            const response = await fetch("/ask-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    image: base64Image,
                    mime_type: file.type,
                    question: question || "Explain this image in simple words for a college student."
                })
            });

            const data = await response.json();

            result.innerHTML = `
                <strong>🌸 Buddy's Explanation</strong>
                <br><br>
                ${formatAnswer(data.answer)}
            `;

        } catch (error) {

            result.innerHTML = `
                <strong>🥺 Something went wrong.</strong>
                <br><br>
                Please try again.
            `;

            console.error(error);
        }
    };

    reader.readAsDataURL(file);
}
// ================================
// QUIZ MODE
// ================================

function openQuiz() {
    document.getElementById("quizModal").style.display = "flex";
}

function closeQuiz() {
    document.getElementById("quizModal").style.display = "none";
}

async function generateQuiz() {

    const subject = document.getElementById("quizSubject").value.trim();
    const topic = document.getElementById("quizTopic").value.trim();
    const numberOfQuestions =
        document.getElementById("quizQuestions").value;

    const result = document.getElementById("quizResult");

    if (!subject || !topic || !numberOfQuestions) {

        result.style.display = "block";

        result.innerHTML = `
            <strong>🌷 Almost there!</strong>
            <br><br>
            Please fill in all the details first.
        `;

        return;
    }

    result.style.display = "block";

    result.innerHTML = `
        <div class="empty-answer">
            <div class="empty-icon">🤔</div>
            <p>Buddy is creating your quiz...</p>
            <span>Preparing your questions ✨</span>
        </div>
    `;

    const prompt = `
You are Campus Buddy, an AI quiz master.

Create exactly ${numberOfQuestions} multiple-choice questions.

Subject: ${subject}
Topic: ${topic}

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Use this exact format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0,
      "explanation": "Short explanation"
    }
  ]
}

Important:
- answer must be the number 0, 1, 2, or 3.
- 0 means the first option.
- 1 means the second option.
- 2 means the third option.
- 3 means the fourth option.
- Make the questions suitable for a college student.
- Make all four options plausible.
`;

    try {

        const response = await fetch("/ask", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: prompt
            })
        });

        const data = await response.json();

        let quizData;

        try {
            quizData = JSON.parse(data.answer);
        } catch (error) {

            const cleaned = data.answer
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            quizData = JSON.parse(cleaned);
        }

        startQuiz(quizData.questions);

    } catch (error) {

        result.innerHTML = `
            <strong>🥺 Something went wrong.</strong>
            <br><br>
            Please try generating the quiz again.
        `;

        console.error(error);
    }
}
let currentQuiz = [];
let currentQuestion = 0;
let quizScore = 0;
let selectedAnswers = [];

function startQuiz(questions) {

    currentQuiz = questions;
    currentQuestion = 0;
    quizScore = 0;
    selectedAnswers = [];

    showQuizQuestion();
}

function showQuizQuestion() {

    const result = document.getElementById("quizResult");

    const question = currentQuiz[currentQuestion];

    result.innerHTML = `

        <div class="quiz-progress">
            Question ${currentQuestion + 1} of ${currentQuiz.length}
        </div>

        <h3 class="quiz-question">
            ${question.question}
        </h3>

        <div class="quiz-options">

            ${question.options.map((option, index) => `

                <label class="quiz-option">

                    <input
                        type="radio"
                        name="quizAnswer"
                        value="${index}"
                    >

                    <span>
                        ${option}
                    </span>

                </label>

            `).join("")}

        </div>

        <button
            class="generate-plan"
            onclick="nextQuizQuestion()"
        >
            ${currentQuestion === currentQuiz.length - 1
                ? "Submit Quiz 🎉"
                : "Next Question →"}
        </button>
    `;
}

function nextQuizQuestion() {

    const selected = document.querySelector(
        'input[name="quizAnswer"]:checked'
    );

    if (!selected) {

        alert("Please choose an answer first 🌸");
        return;
    }

    const answer = Number(selected.value);

    selectedAnswers.push(answer);

    if (answer === currentQuiz[currentQuestion].answer) {
        quizScore++;
    }

    currentQuestion++;

    if (currentQuestion < currentQuiz.length) {

        showQuizQuestion();

    } else {

        showQuizResult();
    }
}

function showQuizResult() {

    const result = document.getElementById("quizResult");

    const percentage =
        Math.round((quizScore / currentQuiz.length) * 100);

    let message = "";

    if (percentage >= 80) {
        message = "🎉 Amazing! You really know your stuff!";
    }
    else if (percentage >= 60) {
        message = "🌸 Good job! Keep practicing and you'll get even better!";
    }
    else {
        message = "💪 Don't worry! Review the topic and try again!";
    }

    result.innerHTML = `

        <div style="text-align:center;">

            <div style="font-size:45px;">🏆</div>

            <h3>Quiz Complete!</h3>

            <div style="
                font-size:42px;
                font-weight:700;
                color:#d487aa;
                margin:10px 0;
            ">
                ${quizScore}/${currentQuiz.length}
            </div>

            <p>
                ${percentage}%
            </p>

            <p style="
                font-weight:600;
                color:#765d70;
            ">
                ${message}
            </p>

        </div>

        <hr>

        <strong>📚 Review</strong>

        ${currentQuiz.map((question, index) => {

            const userAnswer = selectedAnswers[index];

            const correct = userAnswer === question.answer;

            return `

                <div style="
                    margin-top:18px;
                    padding:15px;
                    background:white;
                    border-radius:12px;
                ">

                    <strong>
                        ${index + 1}. ${question.question}
                    </strong>

                    <br><br>

                    Your answer:
                    ${question.options[userAnswer]}

                    <br>

                    Correct answer:
                    ${question.options[question.answer]}

                    <br><br>

                    <span>
                        ${correct ? "✅ Correct!" : "❌ Incorrect"}
                    </span>

                    <br><br>

                    <small>
                        ${question.explanation}
                    </small>

                </div>
            `;

        }).join("")}

        <button
            class="generate-plan"
            onclick="startQuiz(currentQuiz)"
        >
            🔄 Try Again
        </button>
    `;
}
// =============================
// POMODORO TIMER
// =============================

let pomodoroInterval = null;

let pomodoroSeconds = 25 * 60;

let pomodoroMode = "focus";

let pomodoroSession = 1;

let pomodoroRunning = false;


// Open Pomodoro
function openPomodoro() {

    document.getElementById("pomodoroModal").style.display = "flex";

    resetPomodoro();
}


// Close Pomodoro
function closePomodoro() {

    document.getElementById("pomodoroModal").style.display = "none";

    clearInterval(pomodoroInterval);

    pomodoroRunning = false;
}


// Start / Pause Pomodoro
function startPomodoro() {

    const button = document.getElementById("pomodoroStart");

    if (pomodoroRunning) {

        clearInterval(pomodoroInterval);

        pomodoroRunning = false;

        button.innerHTML = "▶ Continue Focusing";

        return;
    }

    pomodoroRunning = true;

    button.innerHTML = "⏸ Pause";

    pomodoroInterval = setInterval(() => {

        pomodoroSeconds--;

        updatePomodoroDisplay();

        if (pomodoroSeconds <= 0) {

            clearInterval(pomodoroInterval);

            pomodoroRunning = false;

            switchPomodoroMode();
        }

    }, 1000);
}


// Update timer display
function updatePomodoroDisplay() {

    const minutes = Math.floor(pomodoroSeconds / 60);

    const seconds = pomodoroSeconds % 60;

    document.getElementById("pomodoroTime").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// Switch Focus / Break
function switchPomodoroMode() {

    const button = document.getElementById("pomodoroStart");

    if (pomodoroMode === "focus") {

        pomodoroMode = "break";

        pomodoroSeconds = 5 * 60;

        document.getElementById("pomodoroMode").textContent =
            "SHORT BREAK";

        document.getElementById("pomodoroSession").textContent =
            `Session ${pomodoroSession} 🌸`;

        document.getElementById("pomodoroMessage").textContent =
            "You earned a little break! ☕";

    } else {

        pomodoroMode = "focus";

        pomodoroSession++;

        pomodoroSeconds = 25 * 60;

        document.getElementById("pomodoroMode").textContent =
            "FOCUS TIME";

        document.getElementById("pomodoroSession").textContent =
            `Session ${pomodoroSession} 🌸`;

        document.getElementById("pomodoroMessage").textContent =
            "Ready for another round? 💪";
    }

    button.innerHTML = "▶ Start";

    updatePomodoroDisplay();

    alert(
        pomodoroMode === "break"
            ? "🎉 Focus session complete! Time for a short break!"
            : "🌸 Break is over! Ready to focus again?"
    );
}


// Reset Pomodoro
function resetPomodoro() {

    clearInterval(pomodoroInterval);

    pomodoroRunning = false;

    pomodoroMode = "focus";

    pomodoroSeconds = 25 * 60;

    pomodoroSession = 1;

    document.getElementById("pomodoroMode").textContent =
        "FOCUS TIME";

    document.getElementById("pomodoroSession").textContent =
        "Session 1 🌸";

    document.getElementById("pomodoroStart").innerHTML =
        "▶ Start Focusing";

    updatePomodoroDisplay();
}

    
        
