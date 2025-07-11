import React, { useEffect, useState } from 'react';
import './QuizPage.css';
import axios from 'axios';
import { windowlistner } from '../WindowListener/WindowListener';

const QuizPage = () => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [mode, setMode] = useState('attempt');
  const [quizData, setQuizData] = useState(null);
  const [position, setposition] = useState({ x: 0, y: 0 });

  const handleAnswerChange = (qIndex, value) => {
    const updated = [...userAnswers];
    console.log(updated)
    updated[qIndex] = value;
    setUserAnswers(updated);
  };


  windowlistner('pointermove', (e) => {
    setposition({ x: e.clientX, y: e.clientY })
  })

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('https://voxify-k2iw.onrender.com/chat/fetchQuizQuestion');
      setQuizData(res.data.msg);
    } catch (error) {
      console.log("Cannot fetch the questions from database");
    }
  };

  const handleAttemptSubmit = (e) => {
    e.preventDefault();
    let tempScore = 0;
    if (quizData) {
      quizData.forEach((q, index) => {
        if (q.answer.trim().toLowerCase() === userAnswers[index]?.trim().toLowerCase()) {
          tempScore++;
        }
      });
    }
    setScore(tempScore);
    setMode('result');
  };

  const resetQuiz = () => {
    setUserAnswers([]);
    setScore(0);
    setCurrentQuestion(0);
    setMode('attempt');
  };

  if (!quizData) {
    return <div className="quiz-page">Loading...</div>;
  }

  const getCurrentQuestionOptions = () => {
    const currentQ = quizData[currentQuestion];
    return [
      currentQ.option1,
      currentQ.option2,
      currentQ.option3,
      currentQ.option4
    ];
  };

  return (
    <div className="quiz-page">
      <div className="cursor" style={{
        ...styles.cursor,
        transform: `translate(${position.x}px, ${position.y}px)`
      }}></div>

      <h1>Quiz Section</h1>
      {mode === 'attempt' && (
        <div className="attempt-section">
          <h2>Quiz</h2>
          <form onSubmit={handleAttemptSubmit}>
            <div className="question-box">
              <p>
                {currentQuestion + 1}. {quizData[currentQuestion].question}
              </p>
              {getCurrentQuestionOptions().map((opt, i) => (
                <label className='labeling' key={i}>
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
                className='merabtn'
                type="button"
                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {currentQuestion < quizData.length - 1 && (
                <button
                  className='merabtn'
                  type="button"
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(prev + 1, quizData.length - 1)
                    )
                  }
                >
                  Next
                </button>
              )}
              {currentQuestion === quizData.length - 1 && (
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
            You scored {score} out of {quizData.length}
          </p>
          <div className="button-group">
            <button className='merabtn' onClick={resetQuiz}>Retake Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  cursor: {
    transition: "all 0.2s ease",
    height: '60px',
    width: '60px',
    borderRadius: '50%',
    position: 'fixed',
    border: "2px solid rgba(255, 255, 255, 0.8)",
    pointerEvents: "none",
    left: -30,
    top: -30,
    zIndex: 9999,
    mixBlendMode: 'difference'
  },
}

export default QuizPage;