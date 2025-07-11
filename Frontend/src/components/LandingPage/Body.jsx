import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faGraduationCap, faHeadphones, faLightbulb, faTableColumns, faUser } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { windowlistner } from "./WindowListener";
import { Link, useNavigate } from "react-router-dom";
import upload from '../../picture/upload.jpg'
import generate from '../../picture/generate.jpg'
import privacy from '../../picture/privacy.png'
import Particles from './Particles.jsx';
import Axios from 'axios'
import './Body.css'

gsap.registerPlugin(ScrollTrigger);

function Body() {
    const [position, setposition] = useState({ x: 0, y: 0 });
    const [backend, setbackend] = useState('');

    const navigate = useNavigate();

    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })

    const getdata = async () => {
        const res = await Axios.get("https://voxify-k2iw.onrender.com")
        setbackend(res.data.message)
        console.log(res.data.message)
    }

    useEffect(() => {
        getdata()
    }, [])


    useGSAP(() => {
        gsap.from(".summary", {
            x: -100,
            opacity: 0,
            delay: 1,
            duration: 1,
            scrollTrigger: ".summary"
        })
    })

    useGSAP(() => {
        let tl = gsap.from(".summarys", {
            x: -100,
            opacity: 0,
            delay: 1,
            duration: 1,
            scrollTrigger: ".summarys"
        })
    })

    useGSAP(() => {
        let tl = gsap.from(".summaryss", {
            x: -100,
            opacity: 0,
            delay: 1,
            duration: 1,
            scrollTrigger: ".summaryss"
        })
    })

    useGSAP(() => {
        gsap.from(".text", {
            y: 100,
            opacity: 0,
            delay: 0.5,
            duration: 0.75,
        })
    })

    useGSAP(() => {
        gsap.from(".efforts", {
            y: 100,
            opacity: 0,
            delay: 0.75,
            duration: 1,
        })
    })

    useGSAP(() => {
        gsap.from(".quote", {
            y: 100,
            opacity: 0,
            delay: 1,
            duration: 1.25,
        })
    })

    useGSAP(() => {
        gsap.from(".button", {
            y: 100,
            opacity: 0,
            delay: 1.25,
            duration: 1.75,
        })
    })

    useGSAP(() => {
        let tl = gsap.from(".privacy", {
            y: 100,
            opacity: 0,
            delay: 0.75,
            duration: 0.75,
            scrollTrigger: ".privacy"
        })
    })

    useGSAP(() => {
        let tl = gsap.from(".power", {
            x: -100,
            opacity: 0,
            delay: 1,
            duration: 1,
            scrollTrigger: ".power"
        })
    })

    useGSAP(() => {
        let tl = gsap.from(".streamline", {
            y: 200,
            opacity: 0,
            delay: 1,
            duration: 1,
            scrollTrigger: ".streamline"
        })
    })

    useGSAP(() => {
        let tl = gsap.from(".innovation", {
            x: 100,
            opacity: 0,
            delay: 1,
            duration: 1,
            scrollTrigger: ".innovation"
        })
    })

    const travel = () => {
        navigate('user/Register')
    }
    return (
        <div style={styles.maindiv} className="!scroll-smooth">
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>
            <div style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1
            }}>
                <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={350}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                />
            </div>
            <div style={{ position: 'relative', zIndex: 999 }}>
                <div style={styles.bodyContainer}>
                    <div style={styles.title} className="Title">
                        {/* <p className=" bg-white">{backend}</p> */}
                        <p className="text">Text That Speaks,</p>
                        <h1 style={styles.color} className="efforts">Effortlessly!</h1>
                    </div>
                    <div style={styles.p} className="quote">
                        <p>The ultimate tool to bring your words to life,</p>
                        <p>powered by innovation.</p>
                    </div>
                    <button style={styles.button} className="button" onClick={travel} >Try VoxiFY</button>
                </div>
                <section style={styles.section}>
                    <div >
                        <p style={styles.heading}>Your Ultimate Personalized AI Companion</p>
                        <div style={styles.upload}  >
                            <div style={styles.summary} className="summary">
                                <FontAwesomeIcon icon={faUser} style={styles.icon} />
                                <p style={styles.summaryTitle}>Upload Your Sources</p>
                                <div className='my-5'>
                                    <p style={styles.summaryText}>
                                        Upload your sources, including PDFs, websites,
                                    </p>
                                    <p style={styles.summaryText}>
                                        Google Docs, or Google Slides. Our AI-powered
                                    </p>
                                    <p style={styles.summaryText}>
                                        system will intelligently summarize the content,
                                    </p>
                                    <p style={styles.summaryText}>
                                        helping you understand and explore your materials
                                    </p>
                                    <p style={styles.summaryText}>
                                        with ease.
                                    </p>
                                </div>
                            </div>
                            <div className="summary" style={styles.imageContainer}>
                                <img src={generate} alt="your sources" style={styles.image} />
                            </div>
                        </div>
                    </div>

                    <div >
                        <div style={styles.upload}>
                            <div style={styles.summary} className="summarys" >
                                <FontAwesomeIcon icon={faBolt} style={styles.icon} />
                                <p style={styles.summaryTitle}>Effortless Understanding</p>
                                <div className='my-5'>
                                    <p style={styles.summaryText}>
                                        With your content uploaded, Voxify provides
                                    </p>
                                    <p style={styles.summaryText}>
                                        personalized answers and generates ideas tailored
                                    </p>
                                    <p style={styles.summaryText}>
                                        to the information that matters most to you.
                                    </p>
                                </div>
                            </div>
                            <div className="summarys" style={styles.imageContainer}>
                                <img src={upload} alt="your sources" style={styles.image} />
                            </div>
                        </div>
                    </div>
                    <div >
                        <div style={styles.upload}>
                            <div style={styles.summary} className="summaryss" >
                                <FontAwesomeIcon icon={faHeadphones} style={styles.icon} />
                                <p style={styles.summaryTitle}>Learn and explore anywhere</p>
                                <div className='my-5'>
                                    <p style={styles.summaryText}>
                                        With the new Audio Overview feature, transform
                                    </p>
                                    <p style={styles.summaryText}>
                                        your sources into immersive “Deep Dive” conversations
                                    </p>
                                    <p style={styles.summaryText}>
                                        instantly, keeping you informed on the go.
                                    </p>
                                </div>
                            </div>
                            <div className="summaryss" style={styles.imageContainer}>
                                <img src={upload} alt="your sources" style={styles.image} />
                            </div>
                        </div>
                    </div>

                </section>
                <section style={styles.privacy} className="privacy">
                    <div>
                        <div style={styles.privs}>
                            <p style={styles.priv}>Your privacy is our priority</p>
                            <p style={styles.privdetail}>At Voxify, we are committed to protecting your personal data. We do not use your uploaded content, queries, or model responses for training purposes, ensuring your information remains secure and private.</p>
                        </div>
                        <div style={styles.privimage}>
                            <img src={privacy} alt="your sources" style={styles.images} />
                        </div>
                    </div>
                </section>

                <section >
                    <p style={styles.ideas}>See how users are unlocking smarter insights with Voxify.</p>
                    <div style={styles.boxes}>
                        <div style={styles.input} className="power">
                            <FontAwesomeIcon icon={faGraduationCap} style={styles.iconss} />
                            <p style={styles.bo}>Power Learning</p>
                            <p style={styles.inputtext}>Upload lectures, textbooks, and research papers. Ask Voicefy to simplify complex topics, provide practical examples, and boost your comprehension. </p>
                            <p style={styles.quote}>Learn smarter, faster.</p>
                        </div>
                        <div style={styles.input} className="streamline">
                            <FontAwesomeIcon icon={faTableColumns} style={styles.iconss} />
                            <p style={styles.bo}>Streamline Your Ideas</p>
                            <p style={styles.inputtext}>Upload your materials, and let Voicefy craft a refined presentation outline with key points and supporting details. </p>
                            <p style={styles.quote}>Deliver with clarity.</p>
                        </div>
                        <div style={styles.input} className="innovation">
                            <FontAwesomeIcon icon={faLightbulb} style={styles.iconss} />
                            <p style={styles.bo}>Ignite Innovation</p>
                            <p style={styles.inputtext}>Upload brainstorming notes, market insights, and competitor analysis. Let Voicefy uncover trends, spark fresh ideas, and reveal untapped opportunities.
                            </p>
                            <p style={styles.quote}> Unleash your creative potential.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

const styles = {
    maindiv: {
        backgroundColor: 'rgb(19, 19, 19)',
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: 'linear-gradient()'
    },
    title: {
        marginTop: "100px",
        marginBottom: "30px",
        fontSize: "65px",
        fontWeight: " bolder",
        color: 'rgb(221, 219, 219)',
    },
    p: {
        fontSize: "25px",
        fontWeight: "100",
        color: 'rgb(169, 167, 167)'
    },
    color: {
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent', // Make text transparent to show the gradient
        display: 'inline-block'
    },
    heading: {
        fontSize: "38px",
        marginTop: "125px",
        color: 'rgb(221, 219, 219)',
        cursor: 'pointer'
    },
    upload: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: "70px",
    },
    summary: {
        flex: "1",
        minWidth: "300px",
        textAlign: "left",
        marginBottom: "20px",
        color: "#555",
    },
    summaryTitle: {
        fontSize: "30px",
        fontWeight: "100",
        marginTop: "12px",
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent', // Make text transparent to show the gradient
        marginLeft: "150px"
    },
    icon: {
        fontSize: "35px",
        marginLeft: '150px',
        color: 'rgb(221, 219, 219)',
    },
    summaryText: {
        fontSize: "18px",
        lineHeight: "1.5",
        marginBottom: "5px",
        color: "rgb(169, 167, 167)",
        marginLeft: '150px',
        lineBreak: 'strict',

    },
    imageContainer: {
        flex: "1",
        minWidth: "300px",
        marginBottom: '20px'
    },
    image: {
        marginTop: '60px',
        width: "80%",
        maxWidth: "650px",
        height: "auto",
        borderRadius: "10px",
    },
    images: {
        marginTop: '60px',
        width: "100%",
        maxWidth: "650px",
        height: "50%",
        borderRadius: "10px",
    },
    privacy: {
        marginTop: '20px',
    },
    priv: {
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        fontSize: '40px',
        fontWeight: 'bold'
    },
    privdetail: {
        color: 'rgb(169, 167, 167)',
        fontSize: "20px",
        lineHeight: "1.8",
        marginTop: '40px',
        marginLeft: '230px',
        marginRight: '230px'
    },
    privs: {
        marginTop: "200px"
    },
    privimage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '0',
        marginBottom: '0',
    },
    ideas: {
        color: 'rgb(221, 219, 219)',
        fontSize: '35px',
        marginTop: '150px'
    },
    boxes: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '80px',
    },
    bo: {
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent',
        display: 'block',
        fontSize: '28px'
    },
    inputtext: {
        color: 'rgb(169, 167, 167)',
        fontSize: "22px",
        lineHeight: "2",
        marginTop: "30px",
        marginLeft: "80px",
        marginRight: "80px"
    },
    quote: {
        color: 'rgb(221, 219, 219)',
        fontSize: '22px',
        fontStyle: 'italic',
        fontFamily: 'cursive',
        marginTop: '30px'
    },
    iconss: {
        color: 'rgb(221, 219, 219)',
        fontSize: '43px',
        marginBottom: '25px'
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
    }
}

export default Body;