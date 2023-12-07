// script.js
let currentQuestionIndex = 0;
let data;
let incorrectAttempts = 0;
let incorrectAnswers = [];
let remainingWords = 0;

// Fetch data from the JSON file
fetch('language_data.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
    remainingWords = data.length; // Initialize remainingWords
    displayTotalWords();
    shuffleQuestions();
    displayQuestions();
  })
  .catch(error => console.error('Error fetching data:', error));

function displayTotalWords() {
  const totalWordsElement = document.getElementById('total-words');
  totalWordsElement.textContent = `Remaining Words: ${remainingWords}`;
}

function shuffleQuestions() {
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
}

function displayQuestions() {
  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = ''; // Clear previous content

  const currentQuestion = data[currentQuestionIndex];
  const questionElement = document.createElement('div');
  questionElement.classList.add('question');

  const questionText = document.createElement('p');
  questionText.textContent = `Translate: "${currentQuestion.word}"`;

  const answerInput = document.createElement('input');
  answerInput.setAttribute('type', 'text');
  answerInput.setAttribute('placeholder', 'Enter your answer');

  const feedbackElement = document.createElement('p');
  feedbackElement.classList.add('feedback');

  questionElement.appendChild(questionText);
  questionElement.appendChild(answerInput);
  questionElement.appendChild(feedbackElement);

  questionContainer.appendChild(questionElement);

  // Add event listener to input for Enter key
  answerInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      document.querySelector('button').click();
    }
  });
}

function checkAnswers() {
  const answerInput = document.querySelector('.question input');
  const feedbackElement = document.querySelector('.question .feedback');

  const currentQuestion = data[currentQuestionIndex];
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = currentQuestion.translation.toLowerCase();

  if (userAnswer === correctAnswer) {
    feedbackElement.textContent = 'Correct!';
    remainingWords--; // Decrease the count of remaining words
    displayTotalWords();

    currentQuestionIndex++;
    incorrectAttempts = 0; // Reset incorrect attempts
    if (currentQuestionIndex < data.length) {
      displayQuestions();
    } else {
      displayReview();
    }
  } else {
    feedbackElement.textContent = 'Incorrect. Please try again.';
    incorrectAttempts++;

    if (incorrectAttempts === 2) {
      feedbackElement.textContent = `Hint: The correct answer is "${correctAnswer}".`;
    }

    incorrectAnswers.push({
      word: currentQuestion.word,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer
    });

    answerInput.value = ''; // Clear the input field for another attempt
  }
}

function displayReview() {
  const reviewContainer = document.getElementById('review-container');
  reviewContainer.innerHTML = '<h2>Review Your Answers</h2>';

  if (incorrectAnswers.length === 0) {
    reviewContainer.innerHTML += '<p>Congratulations! You got all answers correct.</p>';
  } else {
    incorrectAnswers.forEach(answer => {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');

      const wordElement = document.createElement('p');
      wordElement.textContent = `Word: "${answer.word}"`;

      const userAnswerElement = document.createElement('p');
      userAnswerElement.textContent = `Your Answer: ${answer.userAnswer}`;

      const correctAnswerElement = document.createElement('p');
      correctAnswerElement.textContent = `Correct Answer: ${answer.correctAnswer}`;
      correctAnswerElement.classList.add('incorrect-feedback');

      reviewElement.appendChild(wordElement);
      reviewElement.appendChild(userAnswerElement);
      reviewElement.appendChild(correctAnswerElement);

      reviewContainer.appendChild(reviewElement);
    });
  }
}