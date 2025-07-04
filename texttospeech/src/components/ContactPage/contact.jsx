import './contact.css'
import emailjs from '@emailjs/browser';
import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import '../LandingPage/Body.css'

const Contact = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, {
                publicKey: 'YOUR_PUBLIC_KEY',
            })
            .then(
                (result) => {
                    console.log('SUCCESS!', result.text);
                    e.target.reset()
                    alert('Email Sent Succesfully !')
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };

    return (
        <div style={styles.contact}>
            <section id='contactPage' >
                {/* <div id="clients">
                <h1 className="contactPageTitle">My Clients</h1>
                <p className="clientDesc">I would hounered to connect with new clients and have some new experience with them.</p>
                
            </div> */}
                <div id="contact">
                    {/* <h1 style={styles.heading} className="contactPageTitle" >Contact Us</h1> */}
                    <div style={styles.contactContainer}>
                        <h3 style={styles.heading}>Contact Us</h3>
                        <span className="contactDesc">Please fill out the form given below to discuss about any issue</span>
                        <form action="" className="contactForm" ref={form} onSubmit={sendEmail}>
                            <input type="text" className='name' placeholder='Your Name' name='your_name' />
                            <input type="text" className="email" placeholder='Your Email' name='your_email' />
                            <textarea name="message" className='msg' placeholder='Your Message'></textarea>
                            <button type='submit' value='send' className="button" >Submit</button>
                            {/* <div className="links">
                                <img src={FacebookIcon} alt="Facebook" className="link" />
                                <img src={TwitterIcon} alt="Twitter" className="link" />
                                <img src={LinkedInIcon} alt="Linkedin" className="link" />
                                <img src={InstagramIcon} alt="Instagram" className="link" />

                            </div> */}
                        </form>
                        <div >
                            <a className="icon" href="https://www.instagram.com/_abhinv04">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a className="icon" href="https://x.com/abhinab981">
                                <FontAwesomeIcon icon={faX} />
                            </a>
                            <a className="icon" href="https://www.linkedin.com/in/abhinab-sharma-220918280/">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                            <a className="icon" href="https://github.com/Abhinab04">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Contact;



const styles = {
    contact: {
        backgroundColor: 'rgb(19,19,19)',
        color: "rgb(173, 167, 167)",
        padding: "40px 20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        fontSize: "38px",
        marginTop: "110px",
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent', // Make text transparent to show the gradient
        display: 'inline-block'
    },


    footer: {
        backgroundColor: 'rgb(19,19,19)',
        color: "rgb(173, 167, 167)",
        padding: "40px 20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
    },
    contactContainer: {
        marginBottom: "30px",
    },
    heading: {
        fontSize: "38px",
        marginTop: "110px",
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent', // Make text transparent to show the gradient
        display: 'inline-block'
    },
    quoteContainer: {
        margin: "30px 30px",
    },
    quote: {
        fontStyle: "italic",
        fontSize: "22px",
        lineHeight: "1.45",
        margin: "0 auto",
        maxWidth: "600px",
        color: "rgb(173, 167, 167)",
    },
    copyRight: {
        marginTop: "20px",
        fontSize: "14px",
        color: "rgb(120, 120, 120)",
    },
    // icon: {
    //     fontSize: "32px",
    //     color: 'rgb(120, 120, 120)',
    //     margin: '10px'
    // transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    //  }
}

// for email js service -> "npm install --save @emailjs/browser"