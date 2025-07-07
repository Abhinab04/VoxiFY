import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faColumns, faDownload, faEllipsisVertical, faFilePdf, faList, faUpload, faVolumeHigh, faArrowUp, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { windowlistner } from "../LandingPage/WindowListener";
import { useRef } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import '../Header/header.css'
import './InnerDashboard.css'

function InnerDashboard() {

    const inputFile = useRef(null)

    const [show, setshow] = useState(false)
    const [showss, setshowss] = useState(false)
    const [file, setfile] = useState(null)
    const [pdf, setpdf] = useState(false)
    const [dots, setdots] = useState(false)
    const [deletess, setdeletes] = useState(false)
    const [summ, setsumm] = useState(false)
    const [displayName, setDisplayName] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [mascot, setmascot] = useState(true);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const closing = () => {
        setshow(!show)
    }

    const closings = () => {
        setshowss(!showss)
    }

    const [position, setposition] = useState({ x: 0, y: 0 });

    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })

    const upload_file = (event) => {
        inputFile.current.click();
    }

    const truncateFile = (name, maxLength = 20) => {
        if (name.length <= maxLength) return name;
        else {
            const extIndex = name.lastIndexOf('.');
            const ext = name.substring(extIndex);
            const base = name.substring(0, maxLength - ext.length - 3); // 3 for "..."
            return `${base}...${ext}`;
        }
    }

    const handlefile = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            setfile(file)
            setdots(!dots)
            setpdf(file.type === 'application/pdf')
            const shortname = truncateFile(file.name, 20);
            setDisplayName(shortname);
        }
    }

    const deletes = () => {
        setdeletes(!deletess)
        document.getElementById('alls').style.filter = 'blur(5px)'
    }

    const summarize = () => {
        setsumm(!summ)
        document.getElementById('alls').style.filter = 'blur(5px)'
    }

    const cancell = () => {
        setdeletes(!deletess)
        document.getElementById('alls').style.filter = 'none'
    }
    const cancelll = () => {
        setsumm(!summ)
        document.getElementById('alls').style.filter = 'none'
    }


    const cancal = () => {
        window.location.reload()
    }


    const downloading = async () => {

        const field = document.getElementById('field')
        const fields = document.getElementById('fields')

        if (!file || !field || !fields) {
            console.error('File or Field is Empty!')
            return;
        }

        //pdf transfer and audio recieve----------------------
        const formdata = new FormData;

        formdata.append('pdf', file)
        console.log(formdata)
        const value1 = field.value
        const value2 = fields.value
        formdata.append('value1', value1)
        formdata.append('value2', value2)
        try {
            const res = await axios.post('http://localhost:3001/audio/download', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(res.data.sucess)
            if (res.data.sucess === 'true') {
                try {
                    const response = await axios.get('http://localhost:3001/audio/down', {
                        responseType: 'blob'
                    });
                    const audioblob = new Blob([response.data], { type: "audio/mp3" })
                    const url = window.URL.createObjectURL(audioblob);
                    const link = document.createElement('a')
                    link.href = url;
                    link.setAttribute("download", "output.mp3")
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    console.log(response);
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
        console.log('data has been Transfer to backend')
        console.log(value1)
        console.log(value2)
    }

    //chat with gpt 4o model------------------------------------------
    const sendMessage = async () => {
        if (!inputText.trim()) return;
        const userMessage = { sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setmascot(false);

        try {
            const response = await axios.post('http://localhost:3001/chat/chatting', { inputText })

            const botReply = { sender: 'bot', text: response.data.message };
            setMessages(prev => [...prev, botReply]);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = { sender: 'bot', text: 'Error: Unable to get response.' };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    //summarize directly on one click
    const summary = async () => {
        const field = document.getElementById('fieldss')
        const fields = document.getElementById('fieldsss')
        console.log(field, fields)
        const formdata = new FormData;

        formdata.append('pdf', file)
        console.log(formdata)
        const value1 = field.value
        const value2 = fields.value
        formdata.append('value1', value1)
        formdata.append('value2', value2)

        const userMessage = { sender: 'user', text: "Give summary of the content" };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setmascot(false);

        try {
            const response = await axios.post('http://localhost:3001/chat/summary', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const botReply = { sender: 'bot', text: response.data.message };
            setMessages(prev => [...prev, botReply]);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = { sender: 'bot', text: 'Error: Unable to get response.' };
            setMessages(prev => [...prev, errorMsg]);
        }
    }

    return (
        <div style={styles.Inner}>
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>
            <div id="alls" style={styles.innner}>
                {/* Sources Section */}
                <div className="sources" style={{
                    ...styles.sources,
                    width: show ? "5%" : "40%",
                }}>
                    <div style={styles.sourcesHeader}>
                        <div style={styles.sourcesandslide}>
                            <p style={{
                                ...styles.title,
                                display: show ? 'none' : 'flex',
                            }}>Sources</p>
                            <p style={styles.line}></p>
                            <FontAwesomeIcon onClick={closing} icon={faList} style={{
                                ...styles.icon,
                                display: show ? 'flex' : 'flex',
                                justifyContent: show ? 'center' : 'space-between',
                                alignItems: show ? 'center' : 'center',
                            }} />
                        </div>
                        <motion.button
                            style={{
                                ...styles.addButton,
                                display: show ? 'none' : 'flex',
                            }}
                            whileHover={{
                                scale: 1.04,
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
                                color: 'white'
                            }}
                            whileTap={{
                                scale: 1.01
                            }}
                            onClick={upload_file}
                        >
                            + Add Source
                        </motion.button>
                        <input type="file" ref={inputFile} onChange={handlefile} name="uploadFile" accept=".pdf" style={{ ...styles.design, }}></input>
                        <div className="pdfs">
                            <div className="ppdfs">
                                <FontAwesomeIcon icon={faFilePdf} onChange={handlefile} className="iison" style={{
                                    display: pdf ? 'flex' : 'none'
                                }} />
                                {file && <p className="para" style={styles.para}>{displayName}</p>}
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faEllipsisVertical} onChange={handlefile} onClick={deletes} className="iisons" style={{
                                    display: dots ? 'flex' : 'none'
                                }} />

                            </div>
                        </div>
                    </div>
                </div>



                {/* Chat Section */}
                <div className="chat" style={{
                    ...styles.chat,
                    width: show ? "90%" : "60%", // only one width assignment
                }}>
                    <div style={styles.chatHeader}>
                        <p style={styles.title}>Chat</p>
                    </div>
                    {mascot &&
                        (
                            <h1 className="mascot" style={{ ...styles.mascot }}>Summarize, Speak, and Chat Intelligently.</h1>
                        )
                    }
                    <div style={styles.uploadsources}>

                        <div className="chatting" style={styles.chatting}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{
                                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                                    margin: '10px 0'
                                }}>
                                    <div style={styles.msg}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>

                        <div style={styles.text} >
                            <textarea
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage()
                                        setmascot(false);
                                    }
                                }}
                                placeholder="Type your message..."
                                style={{ ...styles.inputt }}
                            />
                            <motion.button
                                onClick={sendMessage} style={styles.sendbtn} >
                                <FontAwesomeIcon style={styles.arrowup} icon={faArrowUp} />
                            </motion.button>
                            <motion.button
                                onClick={summarize}
                            >
                                <FontAwesomeIcon className="summary" style={styles.summary} icon={faList} />
                            </motion.button>
                        </div>
                    </div>
                </div>



                {/* Audio Section */}
                <div className="sources" style={{
                    ...styles.sourcess,
                    width: showss ? "5%" : "40%",
                }}>
                    <div style={styles.sourcesHeaderr}>
                        <div style={{
                            ...styles.sourcesandslidee,
                        }}>
                            <p style={{
                                ...styles.titlee,
                                display: showss ? 'none' : 'flex',
                            }}>Studio</p>
                            <FontAwesomeIcon onClick={closings} icon={faList} style={{
                                ...styles.icon,
                                display: showss ? 'flex' : 'flex',
                                justifyContent: showss ? 'center' : 'space-between',
                                alignItems: showss ? 'center' : 'center',
                            }} />
                        </div>
                        <div style={{
                            ...styles.vols,
                            display: showss ? 'none' : 'flex',
                            justifyContent: showss ? 'center' : 'space-between',
                            alignItems: showss ? 'center' : 'center',
                        }}>
                            <FontAwesomeIcon onClick={closings} icon={faVolumeHigh} style={{
                                ...styles.volume,

                            }} />
                            <p>Listen Instead of Reading</p>
                            <p>Convert text to speech and enjoy a hands-free experience.</p>
                        </div>
                        <div id="blur" style={{
                            ...styles.paging,
                            display: showss ? 'none' : 'flex',
                            justifyContent: showss ? 'center' : 'space-between',
                            alignItems: showss ? 'center' : 'center',
                        }}>
                            <div style={styles.start}>
                                <div style={styles.st}>
                                    <p>Start Page</p>
                                    <input id='field' style={styles.field}></input>
                                </div>

                                <div style={styles.d}>
                                    <p>End Page</p>
                                    <input id='fields' style={styles.field}></input>
                                </div>
                            </div>

                        </div>
                        <motion.button id="blur" style={{
                            ...styles.downloadButton,
                            display: showss ? 'none' : 'flex',
                            justifyContent: showss ? 'center' : 'space-between',
                            alignItems: showss ? 'center' : 'center',
                        }}
                            whileHover={{
                                scale: 1.04,
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                boxShadow: '0 10px 20px rgba(78, 205, 196, 0.2)',
                                color: 'white'
                            }}
                            whileTap={{
                                scale: 1.01
                            }}
                            onClick={downloading} > <FontAwesomeIcon onClick={closings} icon={faDownload} style={styles.down} />Download Audio</motion.button>
                    </div>
                </div>
            </div>
            {
                deletess &&
                (
                    <div className="deletedialog">
                        <p className="delte_name">Delete {displayName}</p>
                        <div className="dialogbtn">
                            <button className="cancel" onClick={cancell}>Cancel</button>
                            <button className="cancel" onClick={cancal}>Delete</button>
                        </div>
                    </div>
                )
            }

            {
                summ &&
                (
                    <div className="deletedialogg">
                        <p className="delte_name">Select the pages</p>
                        <div style={styles.start}>
                            <div style={styles.st}>
                                <p>Start Page</p>
                                <input id='fieldss' style={styles.field}></input>
                            </div>

                            <div style={styles.d}>
                                <p>End Page</p>
                                <input id='fieldsss' style={styles.field}></input>
                            </div>
                        </div>
                        <div className="dialogbtnn">
                            <button className="cancel" onClick={cancelll}>Cancel</button>
                            <button className="cancel" onClick={summary}>Submit</button>
                        </div>
                    </div>
                )
            }


            {/* <div className="process">
                <p className="processname">. . . Processing</p>
            </div> */}
        </div>
    );
}

const styles = {
    icon: {
        fontSize: '24px',
        marginBottom: '12px',
    },
    design: {
        marginTop: '30px',
        display: 'none'
    },
    quote: {
        fontSize: '20px',
        marginBottom: '12px',
    },
    Inner: {
        backgroundColor: 'rgb(19, 19, 19)',
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
    },
    innner: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "10px",
    },
    sources: {
        border: "1px solid gray",
        borderRadius: "8px",
        width: "40%",
        textAlign: "left",
        backgroundColor: "#1e1e1e",
        height: "85vh",
        boxShadow: "0 0 20px rgba(181, 174, 174, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: '25px'
    },
    sourcess: {
        border: "1px solid gray",
        borderRadius: "8px",
        width: "40%",
        textAlign: "left",
        backgroundColor: "#1e1e1e",
        height: "85vh",
        boxShadow: "0 0 20px rgba(181, 174, 174, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: '25px'
    },
    chat: {
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "8px",
        width: "60%",
        textAlign: "center",
        backgroundColor: "#1e1e1e",
        height: "85vh",
        boxShadow: "0 0 20px rgba(181, 174, 174, 0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

    },
    sourcesHeader: {
        display: "block",
        alignItems: "center",
        marginBottom: "28px",

    },
    sourcesHeaderr: {
        display: "block",
        alignItems: "center",
        marginBottom: "28px",

    },
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    titlee: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    subtitle: {
        fontSize: "14px",
        color: "gray",
    },
    addButton: {
        padding: "8px 15px",
        background: 'rgba(255, 255, 255, 0.05)',
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: '10px',
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        boxShadow: '0 0 15px rgba(78, 205, 196, 0.3)',
        color: 'white',
        /* Ensure text color is explicitly set */
        textAlign: 'center'
    },
    chatHeader: {
        marginBottom: "20px",
        borderBottom: '1px solid white',
        textAlign: 'left'
    },
    chatBody: {
        textAlign: "center",
    },
    chatLogo: {
        fontSize: "14px",
        color: "gray",
        marginBottom: "10px",
    },
    uploadButton: {
        padding: "10px 15px",
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        boxShadow: '0 0 15px rgba(78, 205, 196, 0.3)',
        color: 'white',
        /* Ensure text color is explicitly set */
        textAlign: 'center',
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        // marginBottom: "15px",

    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid gray",
        borderRadius: "10px",
        backgroundColor: "#2e2e2e",
        color: "white",
        outline: "none",
    },
    sourcesandslide: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        borderBottom: "1px solid white", // Add a border here
    },
    sourcesandslidee: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        borderBottom: "1px solid white", // Add a border here
    },
    uploadsources: {
        // marginBottom: '200px',
        textAlign: 'center',
        justifyContent: 'space-between',
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
    paging: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
    },
    field: {
        width: "50%",
        padding: "3px 3px",
        border: "2px solid #c49a00",
        borderRadius: "8px",
        backgroundColor: "#1e1e1e",
        border: '1px solid rgba(78, 205, 196, 0.3)',
        boxShadow: '0 0 15px rgba(78, 205, 196, 0.3)',
        /* Ensure text color is explicitly set */
        textAlign: 'center',
        color: "white",
        outline: "none",
        textAlign: "center",
        fontSize: "20px",
        transition: "all 0.3s ease-in-out",
        marginTop: '10px',

    },
    downloadButton: {
        display: "flex", // Center the button horizontally
        margin: "auto",   // Center within its container
        padding: "10px 20px",
        color: "white",
        cursor: "pointer",
        border: '1px solid rgba(78, 205, 196, 0.3)',
        boxShadow: '0 0 15px rgba(78, 205, 196, 0.3)',
        color: 'white',
        /* Ensure text color is explicitly set */
        textAlign: 'center',
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "20%",
        borderRadius: "10px",
    },
    start: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Takes full height of parent
        width: '100%', // Takes full width of parent,
        marginTop: '40px',
        gap: '10px'
    },
    st: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column', // Ensure child elements stack properly
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        backgroundColor: '#1e1d1d',
        borderRadius: '10px',
    },
    d: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column', // Ensure child elements stack properly
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        backgroundColor: '#1e1d1d',
        borderRadius: '10px',
    },
    vols: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#1e1d1d',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        marginTop: '20px',
        color: 'white',
        transition: 'all 0.3s ease-in-out',
    },
    volume: {
        fontSize: '30px',
        color: 'rgb(173, 167, 167)',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
    },
    p: {
        fontSize: '26px',
        margin: '5px 0',
        fontWeight: 'bold',
    },
    down: {
        fontSize: '23px',
        color: 'white',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        marginRight: '20px'
    },
    textarea: {
        width: "100%",
        minHeight: "50px",
        maxHeight: "150px",
        resize: "vertical",
        padding: "20px",
        borderRadius: "10px",
        fontSize: "16px",
        border: "1px solid #444",
        backgroundColor: "#2a2a2a",
        color: "#fff",
        outline: "none",
        border: '1px solid rgba(78, 205, 196, 0.3)',
        boxShadow: '0 0 15px rgba(78, 205, 196, 0.3)',
        color: 'white',
        /* Ensure text color is explicitly set */
    },
    arrow: {
        position: "relative",
        left: '235px',
        bottom: '50px',
        fontSize: '21px'
    },
    buttonRow: {
        display: 'flex',
        gap: '2rem', // or any spacing like '10px', '16px'
        justifyContent: 'center', // optional
        alignItems: 'center'
    },
    uploadsourcesWrapper: {
        marginTop: '50px'
    },
    text: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '10px',
        backgroundColor: '#2a2a2a',
        padding: '10px 10px',
        borderRadius: '10px',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        boxShadow: '0 0 15px rgba(78, 205, 196, 0.3)',
    },
    inputt: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        outline: 'none',
        padding: '10px',
        overflowY: 'auto',
        resize: 'none',
        lineHeight: '1.4',
        maxHeight: '150px',
        minHeight: '40px',
        width: '100%',
        fontFamily: 'inherit',
    },
    arrowup: {
        fontSize: '21px',
        position: 'relative',
        right: '15px'
    },
    chatting: {
        flexGrow: 1,
        padding: '10px',
        maxHeight: '400px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
    },
    msg: {
        color: 'white',
        padding: '10px',
        borderRadius: '10px',
        display: 'inline-block',
        maxWidth: '80%',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        overflow: 'auto',
        backgroundColor: '#242526',
        border: '1px solid #2f3030',
        // boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        textAlign: 'left'
    },
};

export default InnerDashboard;
