import './Contact.css';
import { windowlistner } from "../WindowListener/WindowListener"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const [position, setposition] = useState({ x: 0, y: 0 });
    const [errors, setErrors] = useState('');

    const navigate = useNavigate;
    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })

    const submit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phn = document.getElementById('phn').value;
        const issue = document.getElementById('message').value;

        try {
            const res = await axios.post('https://voxify-k2iw.onrender.com/chat/issueHappend', {
                name,
                phn,
                email,
                issue
            })
            console.log(res.data);
            if (res.data.sucess === true) {
                navigate('/');
            }
            if (res.data.sucess === false) {
                setErrors(res.data.error)
            }
            console.log("data sent to backend")
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="contact-page">
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>
            <section className="contact-section">
                <div className="contact-container animate-fade-in">
                    <h3 className="contact-heading animate-slide-down">Contact Us</h3>
                    <p className="contact-description animate-slide-down">
                        Please fill out the form below to discuss any issue
                    </p>

                    <form className="contact-form">
                        <div className="form-group animate-slide-up">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Your Name"
                                name="name"
                                id='name'
                                required
                            />
                        </div>

                        <div className="form-group animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Your Phn no."
                                name="phn"
                                id='phn'
                                required
                            />
                        </div>

                        <div className="form-group animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Your Email"
                                name="email"
                                id='email'
                                required
                            />
                        </div>

                        <div className="form-group animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <textarea
                                name="message"
                                className="form-textarea"
                                placeholder="Your Message"
                                id='message'
                                required
                            ></textarea>
                        </div>

                        <button type='submit' className="submit-button animate-slide-up" style={{ animationDelay: '0.6s' }} onClick={submit}>
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
            <div>
                {errors && (
                    <p className="error" style={{
                        ...styles.error,
                        marginTop: errors ? "40px" : "40px",

                    }} {...timingout()} > {errors} </p>
                )}
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
}

export default Contact;