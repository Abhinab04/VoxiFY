import React, { useState } from "react";
import './header.css'

function Header() {
    return (
        <header style={styles.header}>
           <div style={{position:'relative',zIndex:999}}>
             <nav style={styles.nav}>
                <div style={styles.saperate}>
                    <div style={styles.name}>
                        <h1>VoxiFY</h1>
                    </div>
                    <div style={styles.naxs}>
                        <a className="line" href="#features" style={styles.navLink}
                        >Overview</a>
                        <a className="line" href="#contact" style={styles.navLink}>Contact</a>
                    </div>
                </div>
            </nav>
           </div>
        </header>
    );
};

const styles = {
    saperate: {
        display: 'flex',
        justifyContent: 'space-between'

    },
    name: {
        fontFamily: "Arial, sans-serif",
        marginLeft: '200px',
        fontSize: '25px',
        cursor: 'pointer',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent',
        fontWeight: '900',
    },
    header: {
        textAlign: 'center',
        backgroundColor: 'rgb(19, 19, 19)',
        color: 'white',
        padding: '10px',
        position: 'relative',
        top: 0,
        zIndex: 999,
        zIndex: 2
    },
    nav: {
        marginTop: '15px',
    },
    naxs: {
        marginRight: '80px'
    },
    navLink: {
        fontFamily: "Arial, sans-serif",
        color: 'white',
        textDecoration: 'none',
        margin: '0 15px',
        fontSize: '20px',
        cursor: 'pointer',
    },
};


export default Header