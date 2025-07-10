import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Particles from "../LandingPage/Particles";
import '../LandingPage/Body.css'

function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={{position:'relative',zIndex:999}}>
                <div style={styles.contactContainer}>
                <h3 style={styles.heading}>Contact Us</h3>
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
            <div style={styles.quoteContainer}>
                <p style={styles.quote}>
                    "The power of words, amplified by innovation, transforms ideas into reality."
                </p>
            </div>
            <div style={styles.copyRight}>
                <p>&copy; 2025 Voxify. All rights reserved.</p>
            </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: 'rgb(19, 19, 19)',
        color: "rgb(173, 167, 167)",
        padding: "40px 20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        position: 'relative',
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
        zIndex: 999
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
        zIndex: 999
    },
    // icon: {
    //     fontSize: "32px",
    //     color: 'rgb(120, 120, 120)',
    //     margin: '10px'
    // transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    //  }
};

export default Footer;
