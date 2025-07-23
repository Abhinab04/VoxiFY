"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "./hooks/use-outside-click";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { windowlistner } from "../WindowListener/WindowListener";

// Styled components configuration
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
    container: {
        backgroundColor: 'rgb(17, 17, 17)',
        minHeight: '100vh',
        padding: '40px 20px',
        color: 'rgb(173, 167, 167)',
        fontFamily: 'Inter, system-ui, sans-serif',
    },
    titleCard: {
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative',
        padding: '20px',
    },
    titleText: {
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent',
        fontWeight: '900',
        animation: 'gradient 15s ease infinite',

    },
    subtitle: {
        color: 'rgb(163, 163, 163)',
        fontSize: '1rem',
        marginTop: '10px',
    },
    cardList: {
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        backgroundColor: 'rgb(26, 26, 26)',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
    },
    cardHover: {
        backgroundColor: 'rgb(32, 32, 32)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'rgb(229, 229, 229)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    modal: {
        position: 'fixed',
        inset: '0',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        zIndex: 100,
    },
    modalContent: {
        backgroundColor: 'rgb(26, 26, 26)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        padding: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    modalBody: {
        padding: '24px',
        color: 'rgb(163, 163, 163)',
        fontSize: '0.95rem',
        lineHeight: '1.6',
    },
    closeButton: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.2s ease',
    },
    scrollbar: {
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
        },
    },
    // Animation keyframes
    '@keyframes gradient': {
        '0%': {
            backgroundPosition: '0% 50%'
        },
        '50%': {
            backgroundPosition: '100% 50%'
        },
        '100%': {
            backgroundPosition: '0% 50%'
        }
    }
};

export function ExpandableCardDemo() {
    const [active, setActive] = useState(null);
    const [cards, setcard] = useState([]);
    const [position, setposition] = useState({ x: 0, y: 0 });
    const ref = useRef(null);
    const id = useId();


    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://voxify-1l5b.onrender.com/chat/fetchFlashCardData');
                console.log(res.data.msg);
                setcard(res.data.msg)
            } catch (error) {
                console.error("Error fetching flashcard data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Add the keyframes animation to the document
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setActive(null);
            }
        };

        if (active) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.head.removeChild(style);
        };
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <div style={styles.container}>
            {/* Title Card */}
            <motion.div
                style={styles.titleCard}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 style={styles.titleText}>
                    Flash-Cards
                </h1>
            </motion.div>
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>

            <AnimatePresence>
                {active && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 50,
                            }}
                        />
                        <div style={styles.modal}>
                            <motion.div
                                layoutId={`card-${active.title}-${id}`}
                                ref={ref}
                                style={styles.modalContent}
                            >
                                <motion.button
                                    style={styles.closeButton}
                                    onClick={() => setActive(null)}
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <CloseIcon />
                                </motion.button>
                                <div style={styles.modalHeader}>
                                    <motion.h3
                                        layoutId={`title-${active.question}-${id}`}
                                        style={styles.title}
                                    >
                                        <span>Q</span>
                                        <span>{active.question}</span>
                                    </motion.h3>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        ...styles.modalBody,
                                        ...styles.scrollbar
                                    }}
                                >
                                    {typeof active.answer === "function"
                                        ? active.answer()
                                        : active.answer}
                                </motion.div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            <div style={styles.cardList}>
                {cards.map((card) => (
                    <motion.div
                        layoutId={`card-${card.question}-${id}`}
                        key={card.question}
                        style={styles.card}
                        whileHover={styles.cardHover}
                        onClick={() => setActive(card)}
                    >
                        <motion.h3
                            layoutId={`title-${card.question}-${id}`}
                            style={styles.title}
                        >
                            <span>Q .</span>
                            <span>{card.question}</span>
                        </motion.h3>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const CloseIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ color: 'rgb(229, 229, 229)' }}
    >
        <line x1="4" y1="4" x2="12" y2="12" />
        <line x1="12" y1="4" x2="4" y2="12" />
    </svg>
);

