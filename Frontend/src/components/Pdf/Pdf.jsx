import React, { useState } from 'react';
import './Pdf.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { windowlistner } from '../LandingPage/WindowListener';

const LoadingSpinner = ({ message }) => (
    <div className="loading-overlay">
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">{message}</div>
        </div>
    </div>
);

const Pdf = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [position, setposition] = useState({ x: 0, y: 0 });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPdfFile(file);
    };

    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    });

    const location = useLocation();
    const locations = location.state;
    const navigate = useNavigate();

    const handleDownload = async () => {
        if (!pdfFile || !startPage || !endPage) {
            alert('Please select PDF and enter page numbers!');
            return;
        }

        const field = document.getElementById('field');
        const fields = document.getElementById('fields');
        const formdata = new FormData();

        formdata.append('pdf', pdfFile);
        const value1 = field.value;
        const value2 = fields.value;
        formdata.append('value1', value1);
        formdata.append('value2', value2);

        setLoading(true);

        try {
            if (locations === 'Quiz') {
                setLoadingMessage('Generating Quiz...');
                const res = await axios.post('https://voxify-k2iw.onrender.com/chat/quizDownload', formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (res.data.sucess === 'true') {
                    setLoadingMessage('Downloading Quiz...');
                    const res = await axios.get('https://voxify-k2iw.onrender.com/chat/downPdf', {
                        responseType: 'blob'
                    });
                    const blob = new Blob([res.data], { type: 'text/plain' });
                    const a = document.createElement('a');
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = 'QuizQuestionAnswer.txt';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }

            if (locations === 'FlashCard') {
                setLoadingMessage('Generating Flashcards...');
                const res = await axios.post('https://voxify-k2iw.onrender.com/chat/submitPDF', formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.data.sucess === 'true') {
                    setLoadingMessage('Downloading Flashcards...');
                    const res = await axios.get('https://voxify-k2iw.onrender.com/chat/downloadPDF', {
                        responseType: 'blob'
                    });
                    const blob = new Blob([res.data], { type: 'text/plain' });
                    const a = document.createElement('a');
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = 'FlashCard_Question_Answer.txt';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    const submitbtn = async () => {
        if (!pdfFile || !startPage || !endPage) {
            alert('Please select PDF and enter page numbers!');
            return;
        }

        const field = document.getElementById('field');
        const fields = document.getElementById('fields');
        const formdata = new FormData();

        formdata.append('pdf', pdfFile);
        const value1 = field.value;
        const value2 = fields.value;
        formdata.append('value1', value1);
        formdata.append('value2', value2);

        setLoading(true);

        try {
            if (locations === 'Quiz') {
                setLoadingMessage('Processing Quiz...');
                const res = await axios.post('https://voxify-k2iw.onrender.com/chat/quiz', formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (res.data.sucess === 'true') {
                    navigate('/Dashboard/Quiz');
                }
            }

            if (locations === 'FlashCard') {
                setLoadingMessage('Processing Flashcards...');
                const res = await axios.post('https://voxify-k2iw.onrender.com/chat/FlashCardSection', formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (res.data.sucess === 'true') {
                    navigate('/Dashboard/FlashCard');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <div className="pdf-splitter">
            {loading && <LoadingSpinner message={loadingMessage} />}
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>
            <h1>Upload Your Pdf</h1>
            <div className="card">
                <label className="upload-label">
                    Upload PDF
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        hidden
                    />
                </label>

                {pdfFile && <p className="file-name">Selected: {pdfFile.name}</p>}

                <div className="inputs">
                    <input
                        type="number"
                        placeholder="Start Page"
                        value={startPage}
                        onChange={(e) => setStartPage(e.target.value)}
                        id='field'
                    />
                    <input
                        type="number"
                        placeholder="End Page"
                        value={endPage}
                        onChange={(e) => setEndPage(e.target.value)}
                        id='fields'
                    />
                </div>

                <div className='btn-group'>
                    <button
                        className="download-btn"
                        onClick={handleDownload}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Download Answer'}
                    </button>

                    <button
                        className="submit-btn"
                        disabled={loading}
                        onClick={submitbtn}
                    >
                        {loading ? 'Processing...' : 'Go To Quiz/FlashCard Page'}
                    </button>
                </div>
            </div>
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
};

export default Pdf;