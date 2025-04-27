const quizzes = {
    durga: {
        title: "Durga Puja Traditions",
        questions: [
            {
                question: "How many days is Durga Puja traditionally celebrated?",
                options: ["5 days", "9 days", "10 days", "7 days"],
                answer: 2
            },
            {
                question: "What is the ritual of welcoming Goddess Durga called?",
                options: ["Dashami", "Bodhon", "Sandhi Puja", "Bijoya"],
                answer: 1
            },
            {
                question: "Which musical instrument is traditionally played during Durga Puja?",
                options: ["Tabla", "Sitar", "Dhak", "Flute"],
                answer: 2
            },
            {
                question: "What is 'bhog' in the context of Durga Puja?",
                options: ["A special prayer", "Food offered to the goddess", "A type of decoration", "A farewell ritual"],
                answer: 1
            },
            {
                question: "Which day of Durga Puja is Sindoor Khela celebrated?",
                options: ["Saptami", "Ashtami", "Navami", "Dashami"],
                answer: 3
            }
        ]
    },
    food: {
        title: "Festival Foods Quiz",
        questions: [
            {
                question: "Which sweet is traditionally made during Durga Puja in Bengal?",
                options: ["Gulab Jamun", "Sandesh", "Jalebi", "Ladoo"],
                answer: 1
            },
            {
                question: "What is 'Khichuri' commonly served during?",
                options: ["Ashtami bhog", "Wedding ceremonies", "Lakshmi Puja", "New Year celebrations"],
                answer: 0
            },
            {
                question: "Which of these is NOT a typical Bengali festival food?",
                options: ["Payesh", "Labra", "Dhokla", "Luchi"],
                answer: 2
            },
            {
                question: "What special ingredient is used in 'Basanti Pulao'?",
                options: ["Saffron", "Rose water", "Cinnamon", "Turmeric"],
                answer: 0
            },
            {
                question: "Which dish is traditionally served on Bijoya Dashami?",
                options: ["Malpua", "Pantua", "Mishti Doi", "Various sweets during meet-and-greet"],
                answer: 3
            }
        ]
    },
    india: {
        title: "Indian Heritage Quiz",
        questions: [
            {
                question: "Which ancient text describes the story of Durga slaying Mahishasura?",
                options: ["Ramayana", "Mahabharata", "Devi Mahatmya", "Bhagavad Gita"],
                answer: 2
            },
            {
                question: "In which state was the tradition of Durga Puja first popularized?",
                options: ["West Bengal", "Bihar", "Odisha", "Assam"],
                answer: 0
            },
            {
                question: "What is the traditional art form used to decorate pandals in West Bengal?",
                options: ["Madhubani", "Alpana", "Warli", "Pattachitra"],
                answer: 1
            },
            {
                question: "Which of these is one of Goddess Durga's weapons?",
                options: ["Bow and Arrow", "Trishul", "Chakra", "All of the above"],
                answer: 3
            },
            {
                question: "What does 'Durga' mean in Sanskrit?",
                options: ["Beautiful Goddess", "The Invincible", "Mother of the Universe", "Destroyer of Evil"],
                answer: 1
            }
        ]
    },
    charity: {
        title: "Charity & Giving Quiz",
        questions: [
            {
                question: "What is 'Daan' in Hindu tradition?",
                options: ["A festival", "The act of giving charity", "A prayer ritual", "A type of meditation"],
                answer: 1
            },
            {
                question: "What percentage of their income are Muslims encouraged to give as 'Zakat'?",
                options: ["1%", "2.5%", "5%", "10%"],
                answer: 1
            },
            {
                question: "Which concept in Sikhism involves service to others?",
                options: ["Langar", "Seva", "Sangat", "Ardas"],
                answer: 1
            },
            {
                question: "During which festival is it traditional to feed the poor and needy?",
                options: ["Holi", "Diwali", "All major festivals", "New Year"],
                answer: 2
            },
            {
                question: "What is 'Anna Daan' in Indian tradition?",
                options: ["Giving money", "Offering clothes", "Providing food", "Building shelter"],
                answer: 2
            }
        ]
    }
};

let currentQuiz = "";
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let quizAnswered = false;

const quizContainer = document.getElementById('quiz-container');
const categoryContainer = document.getElementById('category-container');
const resultContainer = document.getElementById('result-container');
const quizTitle = document.getElementById('quiz-title');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const resultMessageElement = document.getElementById('result-message');
const progressBar = document.getElementById('progress-bar');

// Function to start a quiz
function startQuiz(category) {
    currentQuiz = category;
    currentQuestion = 0;
    score = 0;
    scoreElement.textContent = score;

    quizTitle.textContent = quizzes[category].title;
    categoryContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';

    loadQuestion();
}

// Function to load a question
function loadQuestion() {
    quizAnswered = false;
    selectedOption = null;
    nextButton.disabled = true;

    const question = quizzes[currentQuiz].questions[currentQuestion];
    questionElement.textContent = question.question;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Create option elements
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', selectOption);

        optionsContainer.appendChild(optionElement);
    });
}

// Function to handle option selection
function selectOption(e) {
    if (quizAnswered) return;

    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = quizzes[currentQuiz].questions[currentQuestion].answer;

    // Remove previous selection
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });

    // Mark selected option
    e.target.classList.add('selected');
    selectedOption = selectedIndex;

    // Check answer
    if (selectedIndex === correctIndex) {
        e.target.classList.add('correct');
        score++;
        scoreElement.textContent = score;
    } else {
        e.target.classList.add('incorrect');
        options[correctIndex].classList.add('correct');
    }

    quizAnswered = true;
    nextButton.disabled = false;
}

// Event listener for next button
nextButton.addEventListener('click', () => {
    currentQuestion++;

    if (currentQuestion < quizzes[currentQuiz].questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

// Function to show quiz result
function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const totalQuestions = quizzes[currentQuiz].questions.length;
    finalScoreElement.textContent = `${score}/${totalQuestions}`;

    let message = "";
    const percentage = (score / totalQuestions) * 100;

    if (percentage >= 80) {
        message = "Outstanding! Your knowledge is impressive and you've made a real impact today.";
    } else if (percentage >= 60) {
        message = "Great job! Your participation is helping provide meals and support to those in need.";
    } else if (percentage >= 40) {
        message = "Good effort! Every quiz completed brings warmth to someone's life.";
    } else {
        message = "Thank you for participating! Your support helps us reach more people in need.";
    }

    resultMessageElement.textContent = message;

    // Update progress bar
    const currentProgress = 945320; // Current funds in rupees
    const goal = 1200000; // Goal in rupees
    const progressPercentage = (currentProgress / goal) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Function to restart quiz
function restartQuiz() {
    categoryContainer.style.display = 'block';
    resultContainer.style.display = 'none';
}

// Initialize progress bar
document.addEventListener('DOMContentLoaded', () => {
    const currentProgress = 945320;
    const goal = 1200000;
    const progressPercentage = (currentProgress / goal) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Make the first tab active
    document.querySelectorAll('.tab').forEach((tab, index) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});