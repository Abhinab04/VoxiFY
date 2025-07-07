import React, { useState } from 'react';
//import { PDFDocument } from 'pdf-lib';
import './Pdf.css';
import axios from 'axios'
import { useLocation } from 'react-router-dom';

const Pdf = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPdfFile(file);
    };

    const location = useLocation()
    console.log(location.state);
    const locations = location.state

    const handleDownload = async () => {
        if (!pdfFile || !startPage || !endPage) {
            alert('Please select PDF and enter page numbers!');
            return;
        }
        const field = document.getElementById('field');
        const fields = document.getElementById('fields');
        const formdata = new FormData

        formdata.append('pdf', pdfFile);
        console.log(formdata)
        const value1 = field.value;
        const value2 = fields.value;
        formdata.append('value1', value1)
        formdata.append('value2', value2)

        //Quiz Download--------------------
        if (locations === 'Quiz') {
            try {
                const res = await axios.post('http://localhost:3001/chat/quizDownload', formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                console.log(res.data.sucess);
                if (res.data.sucess === 'true') {
                    const res = await axios.get('http://localhost:3001/chat/downPdf', {
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
            } catch (error) {
                console.log(error);
            }
        }

        //Flash Card------------------------------------
        if (locations === 'FlashCard') {
            try {
                const res = await axios.post('http://localhost:3001/chat/submitPDF', formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (res.data.sucess === 'true') {
                    const res = await axios.get('http://localhost:3001/chat/downloadPDF', {
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
            } catch (error) {
                console.log(error);
            }
        }
    };

    const submitbtn = async () => {
        if (!pdfFile || !startPage || !endPage) {
            alert('Please select PDF and enter page numbers!');
            return;
        }
        const field = document.getElementById('field');
        const fields = document.getElementById('fields');
        const formdata = new FormData

        formdata.append('pdf', pdfFile);
        console.log(formdata)
        const value1 = field.value;
        const value2 = fields.value;
        formdata.append('value1', value1)
        formdata.append('value2', value2)
        if (locations === 'Quiz') {
            try {
                const res = await axios.post('http://localhost:3001/chat/quiz', formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                console.log(res.data.sucess);
            } catch (error) {
                console.log(error);
            }
        }

        // if (locations === 'FlashCard') {
        //     const res = await 
        // }
    }

    return (
        <div className="pdf-splitter">
            <h1>Upload Your Pdf</h1>
            <div className="card">
                <label className="upload-label">
                    Upload PDF
                    <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
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
                    <button className="download-btn" onClick={handleDownload} disabled={loading}>
                        {loading ? 'Processing...' : ' Download Answer'}
                    </button>

                    <button className="submit-btn" disabled={loading} onClick={submitbtn}>
                        {loading ? 'Processing...' : ' Go To Quiz Page '}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pdf;