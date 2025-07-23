import React, { useState } from "react";
import '../../Header/header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { windowlistner } from "../../LandingPage/WindowListener";
import { motion, AnimatePresence } from "framer-motion";
import { faBolt, faColumns, faPlus, faTableCellsColumnLock, faTableCellsRowLock } from '@fortawesome/free-solid-svg-icons';
import { text } from "@fortawesome/fontawesome-svg-core";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [select, setselected] = useState('col')
    const [divs, setdivs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', details: '' });
    const [Options, setOptions] = useState(false);

    const navigate = useNavigate();
    const cols = (element) => {
        setselected(element)
    }

    const [position, setposition] = useState({ x: 0, y: 0 });

    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })

    const news = () => {
        setShowForm(true);
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.name.trim() && form.details.trim()) {
            setdivs([...divs, {
                name: form.name,
                details: form.details,
                timestamp: new Date().toISOString() // Added timestamp
            }]);
            setForm({ name: '', details: '' });
            setShowForm(false);
        }
    }

    const hellos = () => {
        console.log("hello world")
        setOptions(true);
    }

    const TTS = () => {
        navigate('/Dashboard/Voxify')
    }

    const Quiz = () => {
        navigate('/Dashboard/pdf', { state: 'Quiz' })
    }

    const Flash = () => {
        navigate('/Dashboard/pdf', { state: 'FlashCard' })
    }

    return (
        <div style={styles.maindiv}>
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>
            <div>
                <div style={styles.mains}>
                    <div style={styles.title}>
                        <div className="divide">
                            <p style={styles.welcome}>Welcome to </p>
                            <p style={styles.mainTitle}>VoxiFY</p>
                        </div>
                        <p style={styles.main}>My NoteCloud</p>
                    </div>
                    <motion.div style={styles.buttons}>
                        <motion.div style={styles.set}
                            whileHover={{
                                scale: 1.04,
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
                                color: 'white'
                            }}
                            whileTap={{
                                scale: 1.01
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} style={styles.icon} />
                            <button style={styles.createnew} onClick={news}>Create new</button>
                        </motion.div>
                        <motion.div
                            style={styles.row_col}
                            whileHover={{
                                scale: 1.04,
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                        >
                            <FontAwesomeIcon onClick={() => { cols('col') }} className="col" icon={faTableCellsRowLock} style={select === 'col' ? styles.selectedicons : styles.iconsss} />
                            <div className="divider"></div>
                            <FontAwesomeIcon onClick={() => { cols('row') }} className="row" icon={faTableCellsColumnLock} style={select === 'row' ? styles.selectedicons : styles.iconsss} />
                        </motion.div>
                    </motion.div>
                    {/* Form */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                style={styles.form}
                            >
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Project Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                                <input
                                    type="text"
                                    name="details"
                                    placeholder="Details"
                                    value={form.details}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                                <button type="submit" style={styles.submitBtn}>Submit</button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                    {/* Project Boxes */}
                    <motion.div style={{
                        ...styles.projectsContainer,
                        flexDirection: select === 'col' ? 'row' : 'column',
                        flexWrap: select === 'col' ? 'wrap' : 'nowrap'
                    }}>
                        <AnimatePresence>
                            {divs.map((proj, idx) => (
                                <motion.div
                                    key={idx}
                                    style={{
                                        ...styles.projectBox,
                                        width: select === 'col' ? 'calc(33.33% - 30px)' : '100%',
                                        minHeight: select === 'col' ? '220px' : '150px',
                                    }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={styles.projectBoxHover}
                                    onClick={hellos}
                                >
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        ...(select === 'row' && { flex: '1' })
                                    }}>
                                        <h3 style={{ marginTop: '5px' }}>Name :</h3>
                                        <h3 style={styles.projectTitle}>{proj.name}</h3>
                                    </div>
                                    <p style={{
                                        ...styles.projectDetails,
                                        ...(select === 'row' && {
                                            flex: '2',
                                            marginBottom: 0
                                        })
                                    }}>Details : {proj.details}</p>
                                    <small style={{
                                        ...styles.timestamp,
                                        ...(select === 'row' && {
                                            position: 'static',
                                            marginLeft: 'auto'
                                        })
                                    }}>
                                        Created: {new Date(proj.timestamp).toLocaleString()}
                                    </small>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Options */}
                    <AnimatePresence>
                        {Options && (
                            <>
                                {/* Overlay with blur effect */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={styles.overlay}
                                    onClick={() => setOptions(false)}
                                />

                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    style={styles.optionsContainer}
                                >
                                    {/* Close Button */}
                                    <motion.div
                                        style={styles.closeButton}
                                        onClick={() => setOptions(false)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        ✕
                                    </motion.div>

                                    <motion.div style={styles.optionsWrapper}>
                                        <motion.div
                                            style={styles.optionItem}
                                            whileHover={{
                                                scale: 1.05,
                                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                                boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={TTS}
                                        >
                                            <span>TTS</span>
                                        </motion.div>
                                        <motion.div
                                            style={styles.optionItem}
                                            whileHover={{
                                                scale: 1.05,
                                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                                boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={Quiz}
                                        >
                                            <span>Quiz</span>
                                        </motion.div>
                                        <motion.div
                                            style={styles.optionItem}
                                            whileHover={{
                                                scale: 1.05,
                                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                                boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={Flash}
                                        >
                                            <span>Flash Card</span>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 998,
    },

    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
    },

    optionsContainer: {
        position: 'fixed',
        top: '40%',
        left: '35%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px 30px 20px',  // increased top padding for close button
        border: '1px solid rgba(78, 205, 196, 0.3)',
        boxShadow: '0 4px 30px rgba(78, 205, 196, 0.2)',
    },

    optionsWrapper: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
    },

    optionItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '140px',
        height: '140px',
        color: 'white',
        gap: '15px',
    },

    optionIcon: {
        fontSize: '30px',
        color: '#4ECDC4',
    },
    createnew: {
        background: 'none',
        border: 'none',
        color: 'inherit',
        fontSize: '20px',
        cursor: 'pointer',
        outline: 'none'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        margin: '20px 0',
        background: 'rgba(255,255,255,0.03)',
        padding: '20px',
        borderRadius: '10px',
        width: '300px'
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        color: 'white'
    },
    submitBtn: {
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    projectsContainer: {
        marginTop: '20px',
        display: 'flex',
        gap: '30px',
        padding: '15px',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        width: '100%',
    },

    projectBox: {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '20px',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(78, 205, 196, 0.15)',
        minWidth: '250px',
        height: 'auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        display: 'flex',
        flexDirection: 'column',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(78, 205, 196, 0.5)',
            borderRadius: '3px',
        },
    },
    projectTitle: {
        fontSize: '22px',
        marginBottom: '12px',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '600',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    projectDetails: {
        fontSize: '16px',
        lineHeight: '1.5',
        color: 'rgba(255,255,255,0.8)',
        margin: '0',
        marginBottom: '15px',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 6,
        WebkitBoxOrient: 'vertical',
    },
    timestamp: {
        position: 'absolute',
        bottom: '10px',
        left: '20px',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
    },
    maindiv: {
        backgroundColor: 'rgb(19, 19, 19)',
        padding: "90px",
        fontFamily: "Arial, sans-serif",
        minHeight: '90vh',
    },
    title: {
        borderBottom: '2px solid rgb(173, 167, 167)',
        borderRadius: '3px'
    },
    welcome: {
        fontSize: "65px",
        fontWeight: '500',
        color: 'rgb(173, 167, 167)',
    },
    mainTitle: {
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent', // Make text transparent to show the gradient
        display: 'inline-block',
        fontSize: "65px",
        fontWeight: '700'
    },
    main: {
        fontSize: '38px',
        marginTop: '15px',
        marginBottom: '15px',
        color: 'rgb(168, 171, 171)',
        marginLeft: '8px'
    },
    mains: {
        display: 'block',
        padding: '0 100px',
        marginTop: '50px'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '20px',
        color: 'rgb(173, 167, 167)',
        marginTop: '8px'
    },
    set: {
        display: 'flex',
        gap: "15px",
        marginLeft: '35px',
        borderRadius: '30px',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        padding: '15px 18px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
    },
    icon: {
        marginTop: '5px'
    },
    row_col: {
        display: 'flex',
        gap: '15px',
        marginRight: '50px',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        padding: '10px 20px',
        borderRadius: '50px',
        position: 'relative',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
    },
    row_colHover: {
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        color: 'white',
        transform: 'translateY(-3px)',
        boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
    },
    iconsss: {
        marginTop: '5px',
        fontSize: '23px'
    },
    selectedicons: {
        marginTop: '5px',
        fontSize: '23px',
        cursor: 'pointer',
        color: 'white',
    },
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

export default Dashboard