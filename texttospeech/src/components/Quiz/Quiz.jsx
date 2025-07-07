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
                            required
                        />
                        {questions.map((q, index) => (
                            <div className="question-box" key={index}>
                                <input
                                    type="text"
                                    placeholder={`Question ${index + 1}`}
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                    required
                                    className="full-width"
                                />

                                <div className="option-grid">
                                    <input
                                        type="text"
                                        placeholder="Option 1"
                                        value={q.options[0]}
                                        onChange={(e) => handleOptionChange(index, 0, e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Option 2"
                                        value={q.options[1]}
                                        onChange={(e) => handleOptionChange(index, 1, e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Option 3"
                                        value={q.options[2]}
                                        onChange={(e) => handleOptionChange(index, 2, e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Option 4"
                                        value={q.options[3]}
                                        onChange={(e) => handleOptionChange(index, 3, e.target.value)}
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Correct Answer"
                                    value={q.answer}
                                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                    required
                                    className="full-width"
                                />
                            </div>
                        ))}

                        <div className="button-group">
                            <button type="button" onClick={addQuestion}>
                                ➕ Add Question
                            </button>
                            <button type="submit">Create Quiz</button>
                        </div>
                    </form>
                </div>
            )}

            {mode === 'attempt' && quiz && (
                <div className="attempt-section">
                    <h2>{quiz.title}</h2>
                    <form onSubmit={handleAttemptSubmit}>
                        {quiz.questions.map((q, index) => (
                            <div className="question-box" key={index}>
                                <p>
                                    {index + 1}. {q.question}
                                </p>
                                {q.options.map((opt, i) => (
                                    <label key={i}>
                                        <input
                                            type="radio"
                                            name={`q${index}`}
                                            value={opt}
                                            checked={userAnswers[index] === opt}
                                            onChange={() => handleAnswerChange(index, opt)}
                                            required
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ))}
                        <button type="submit">🚀 Submit Quiz</button>
                    </form>
                </div>
            )}

            {mode === 'result' && (
                <div className="result-section">
                    <h2>Result</h2>
                    <p>
                        🎯 You scored {score} out of {quiz.questions.length}
                    </p>
                    <div className="button-group">
                        <button onClick={() => setMode('attempt')}>Retake Quiz</button>
                        <button onClick={() => setMode('create')}>Create New Quiz</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;