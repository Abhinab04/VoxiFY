import React, { useState, useEffect } from 'react';
import './QuizPage.css';

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: '' },
  ]);
  const [mode, setMode] = useState('create');
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const storedQuiz = JSON.parse(localStorage.getItem('quiz'));
    if (storedQuiz) {
      setQuiz(storedQuiz);
    }
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newQuiz = { title: quizTitle, questions };
    localStorage.setItem('quiz', JSON.stringify(newQuiz));
    setQuiz(newQuiz);
    alert('Quiz Created!');
    setMode('attempt');
  };

  const handleAnswerChange = (qIndex, value) => {
    const updated = [...userAnswers];
    updated[qIndex] = value;
    setUserAnswers(updated);
  };

  const handleAttemptSubmit = (e) => {
    e.preventDefault();
    let tempScore = 0;
    quiz.questions.forEach((q, index) => {
      if (q.answer.trim().toLowerCase() === userAnswers[index]?.trim().toLowerCase()) {
        tempScore++;
      }
    });
    setScore(tempScore);
    setMode('result');
  };

  return (
    <div className="quiz-page">
      <h1>Quiz Section</h1>

      {mode === 'create' && (
        <div className="create-section">
          <h2>Create Quiz</h2>
          <form onSubmit={handleCreateSubmit}>
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              disabled
            />
            {questions.map((q, index) => (
              <div className="question-box" key={index}>
                <input
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  disabled
                  className="full-width"
                />

                <div className="option-grid">
                  {q.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, i, e.target.value)}
                      disabled
                    />
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                  disabled
                  className="full-width"
                />
              </div>
            ))}

            <div className="button-group">
              <button type="button" onClick={addQuestion}>Add Question</button>
              <button type="submit">Create Quiz</button>
            </div>
          </form>
        </div>
      )}

      {mode === 'attempt' && quiz && (
        <div className="attempt-section">
          <h2>{quiz.title}</h2>
          <form onSubmit={handleAttemptSubmit}>
            <div className="question-box">
              <p>
                {currentQuestion + 1}. {quiz.questions[currentQuestion].question}
              </p>
              {quiz.questions[currentQuestion].options.map((opt, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`q${currentQuestion}`}
                    value={opt}
                    checked={userAnswers[currentQuestion] === opt}
                    onChange={() => handleAnswerChange(currentQuestion, opt)}
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>

              {currentQuestion < quiz.questions.length - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, quiz.questions.length - 1))}
                >
                  Next
                </button>
              )}

              {currentQuestion === quiz.questions.length - 1 && (
                <button type="submit">Submit Quiz</button>
              )}
            </div>
          </form>
        </div>
      )}

      {mode === 'result' && (
        <div className="result-section">
          <h2>Result</h2>
          <p>
            You scored {score} out of {quiz.questions.length}
          </p>
          <div className="button-group">
            <button onClick={() => { setMode('attempt'); setCurrentQuestion(0); }}>Retake Quiz</button>
            <button onClick={() => { setMode('create'); setCurrentQuestion(0); }}>Create New Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
