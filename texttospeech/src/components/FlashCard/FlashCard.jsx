"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "./hooks/use-outside-click";
import { motion, AnimatePresence } from "framer-motion";

// Styled components configuration
const styles = {
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
    const ref = useRef(null);
    const id = useId();




    

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
                                        layoutId={`title-${active.title}-${id}`}
                                        style={styles.title}
                                    >
                                        <span>Q</span>
                                        <span>{active.title}</span>
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
                                    {typeof active.content === "function"
                                        ? active.content()
                                        : active.content}
                                </motion.div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>

            <div style={styles.cardList}>
                {cards.map((card) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={card.title}
                        style={styles.card}
                        whileHover={styles.cardHover}
                        onClick={() => setActive(card)}
                    >
                        <motion.h3
                            layoutId={`title-${card.title}-${id}`}
                            style={styles.title}
                        >
                            <span>Q .</span>
                            <span>{card.title}</span>
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

// in cards array/object (down variable) 
// -->> bekar ka keys - {'description', 'src', 'ctaText' } -> keys having no use....
// -->> Kam ka keys - {'title' - for question; 'content' - for answers} 

const cards = [
    {
        description: "Lana Del Rey",
        title: "Summertime Sadness",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    },
    {
        description: "Lana Del Rey",
        title: "coming slow",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf ioasjf ioasfjiosfj sij isj isjf iosafj siaofj siaofjsfajfhsfafuajsfjaifhgfahsou as hasif hsoadf hsaifhsuifh siufh asiufhsafhsiafhsauifhasuifhsaifhdsaufhsfhui   iashui hsu s saf uahfuifh fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf  siaofjsfajfhsfafuajsfjaifhgfahsou as hasif hsoadf hsaifhsuifh siufh asiufhsafhsiafhsauifhasuifhsaifhdsaufhsfhui   iashui hsu s saf uahfuifh fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    },

    {
        description: "Metallica",
        title: "For Whom The Bell Tolls",
        src: "https://assets.aceternity.com/demos/metallica.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Metallica, an iconic American heavy metal band, is renowned for their
                    powerful sound and intense performances that resonate deeply with
                    their audience. Formed in Los Angeles, California, they have become a
                    cultural icon in the heavy metal music industry. <br /> <br />Their
                    songs often reflect themes of aggression, social issues, and personal
                    struggles, capturing the essence of the heavy metal genre. With a
                    career spanning over four decades, Metallica has released numerous hit
                    albums and singles that have garnered them a massive fan following
                    both in the United States and abroad.
                </p>
            );
        },
    },
    {
        description: "Led Zeppelin",
        title: "Stairway To Heaven",
        src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Led Zeppelin, a legendary British rock band, is renowned for their
                    innovative sound and profound impact on the music industry. Formed in
                    London in 1968, they have become a cultural icon in the rock music
                    world. <br /> <br />Their songs often reflect a blend of blues, hard
                    rock, and folk music, capturing the essence of the 1970s rock era.
                    With a career spanning over a decade, Led Zeppelin has released
                    numerous hit albums and singles that have garnered them a massive fan
                    following both in the United Kingdom and abroad.
                </p>
            );
        },
    },
    {
        description: "Mustafa Zahid",
        title: "Toh Phir Aao",
        src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
                    renowned for its intense storyline and powerful performances. Directed
                    by Mohit Suri, the film has become a significant work in the Indian
                    film industry. <br /> <br />The movie explores themes of love,
                    redemption, and sacrifice, capturing the essence of human emotions and
                    relationships. With a gripping narrative and memorable music,
                    "Aawarapan" has garnered a massive fan following both in
                    India and abroad, solidifying Emraan Hashmi's status as a
                    versatile actor.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf ioasjf ioasfjiosfj sij isj isjf iosafj siaofj siaofjsfajfhsfafuajsfjaifhgfahsou as hasif hsoadf hsaifhsuifh siufh asiufhsafhsiafhsauifhasuifhsaifhdsaufhsfhui sdggsg sgfdgsdfg sdfasfdsa fsdf asfasdf asdfasf saf asf sdafasdf sfgsdgsdfgdfsg dsgsdfg dfsgrdstger er tewrt erter t sgfdh er yet ert erwt er gwrwr e erg erlgn erkgherf niheiht iqw huiw hwiue hiuwh tiuh ieu hiuehreiu herui iuerh iweurh wquih fiueh iue hieurh eiruh geui hie iuh iueh ieru hiue iuwe hiueh ih euofhneiuf eiuhe  uer hi  iashui hsu s saf uahfuifh fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    },
    {
        description: "Mustafa Zahid",
        title: "jldi jldi aao",
        src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
                    renowned for its intense storyline and powerful performances. Directed
                    by Mohit Suri, the film has become a significant work in the Indian
                    film industry. <br /> <br />The movie explores themes of love,
                    redemption, and sacrifice, capturing the essence of human emotions and
                    relationships. With a gripping narrative and memorable music,
                    "Aawarapan" has garnered a massive fan following both in
                    India and abroad, solidifying Emraan Hashmi's status as a
                    versatile actor.
                </p>
            );
        },
    },
    {
        description: "Mustafa Zahid",
        title: "jldi mt aao",
        src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
                    renowned for its intense storyline and powerful performances. Directed
                    by Mohit Suri, the film has become a significant work in the Indian
                    film industry. <br /> <br />The movie explores themes of love,
                    redemption, and sacrifice, capturing the essence of human emotions and
                    relationships. With a gripping narrative and memorable music,
                    "Aawarapan" has garnered a massive fan following both in
                    India and abroad, solidifying Emraan Hashmi's status as a
                    versatile actor.
                </p>
            );
        },
    },
    {
        description: "Lana Del Rey",
        title: "coming fast",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    }, {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf ioasjf ioasfjiosfj sij isj isjf iosafj siaofj siaofjsfajfhsfafuajsfjaifhgfahsou as hasif hsoadf hsaifhsuifh siufh dfsgrdstger er tewrt erter t sgfdh er yet ert erwt er gwrwr e erg erlgn erkgherf niheiht iqw huiw hwiue hiuwh tiuh ieu hiuehreiu herui iuerh iweurh wquih fiueh iue hieurh eiruh geui hie iuh iueh ieru hiue iuwe hiueh ih euofhneiuf eiuhe  uer hi  iashui hsu s saf uahfuifh fh 9sh sdf ",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the viave garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    }, {
        description: "Mustafa Zahikjvjhvd",
        title: "jlkhgjkdi mdfhdft aao",
        src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
                    renowned for its intense storyline and powerful performances. Directed
                    by Mohit Suri, the film has become a significant work in the Indian
                    film industry. <br /> <br />The movie explores themes of love,
                    redemption, and sacrifice, capturing the essence of human emotions and
                    relationships. With a gripping narrative and memorable music,
                    "Aawarapan" has garnered a massive fan following both in
                    India and abroad, solidifying Emraan Hashmi's status as a
                    versatile actor.
                </p>
            );
        },
    }, {
        description: "Mustafa jhvjhb Zajkguyfhhid",
        title: "dfgjldi mdfhdft aao",
        src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
                    renowned for its intense storyline and powerful performances. Directed
                    by Mohit Suri, the film has become a significant work in the Indian
                    film industry. <br /> <br />The movie explores themes of love,
                    redemption, and sacrifice, capturing the essence of human emotions and
                    relationships. With a gripping narrative and memorable music,
                    "Aawarapan" has garnered a massive fan following both in
                    India and abroad, solidifying Emraan Hashmi's status as a
                    versatile actor.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf ioasjf ioasfjiosfj sij isj isjf iosafj siaofj siaofjsfajfhsfafuajsfjaifhgfahsou as hasif hsoadf hsaifhsuifh siufh asiufhsafhsiafhsauifhasuifhsaifhdsaufhsfhui sdggsg sgfdgsdfg sdfasfdsa fsdf asfasdf asdfasf saf asf sdafasdf sfgsdgsdfgdfsg dsgsdfg dfsgrdstger er tewrt erter t sgfdh er yet ert erwt er gwrwr e erg erlgn erkgherf niheiht  iashui hsu s saf uahfuifh fh 9sh ,nmyt ",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    },
    {
        description: "Mustafa Zahid",
        title: "jldi mfghd  dffgt aao",
        src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
                    renowned for its intense storyline and powerful performances. Directed
                    by Mohit Suri, the film has become a significant work in the Indian
                    film industry. <br /> <br />The movie explores themes of love,
                    redemption, and sacrifice, capturing the essence of human emotions and
                    relationships. With a gripping narrative and memorable music,
                    "Aawarapan" has garnered a massive fan following both in
                    India and abroad, solidifying Emraan Hashmi's status as a
                    versatile actor.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf ioasjf ioasfjiosfj sij isj isjf iosafj siaofj as hasif hsoadf hsaifhsuifh siufh  sdggsg sgfdgsdfg sdfasfdsa fsdf asfasdf asdfasf saf asf sdafasdf sfgsdgsdfgdfsg dsgsdfg dfsgrdstger er tewrt erter t sgfdh er yet ert erwt er gwrwr e erg erlgn erkgherf niheiht iqw huiw hwiue hiuwh tiuh ieu hiuehreiu herui iuerh iweurh wquih fiueh iue hieurh eiruh geui hie iuh iueh ieru hiue iuwe hiueh ih euofhneiuf eiuhe  uer hi  iashui hsu s saf uahfuifh 64 646 46 456 464 64 65 46 464 64 6fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    },
    {
        description: "Lana Del Rey",
        title: "coming fsdfdsggast",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf ioasjf ioasfjiosfj sij isj isjf iosafj siaofj siaofjsfajfhsfafuajsfjaifhgfahsou as hasif hsoadf hsaifhsuifh siufh 5 5456 16 1654 651 56 46 651 651 561 561 651asiufhsafhsiafhsauifhasuifhsaifhdsaufhsfhui sdggsg sgfdgsdfg sdfasfdsa fsdf asfasdf asdfasf saf asf sdafasdf sfgsdgsdfgdfsg dsgsdfg dfsgrdstger er tewrt erter t sgfdh er yet ert erwt er gwrwr e erg erlgn erkgherf niheiht iqw huiw hwiue hiuwh tiuh ieu hiuehreiu herui iuerh iweurh wquih fiueh iue hieurh eiruh geui hie iuh iueh ieru hiue iuwe hiueh ih euofhneiuf eiuhe  uer hi  iashui hsu s saf uahfuifh fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    }, {
        description: "Lana Del Rey",
        title: "comindgsdgfdsgg fast",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf wertyuu te yuty  yt ryy uy thl h g   dhhjjkyj yh ffkhdhjjytjrthshhd  46465141651561 erter t sgfdh er yet ert erwt er gwrwr e erg erlgn erkgherf niheiht iqw huiw hwiue hiuwh tiuh ieu hiuehreiu herui iuerh iweurh wquih fiueh iue hieurh eiruh geui hie iuh iueh ieru hiue iuwe hiueh ih euofhneiuf eiuhe  uer hi  iashui hsu s saf uahfuifh fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    }, {
        description: "Lana Del Rey",
        title: "comiasdfsdsfgng sdg d dsg sd  fast",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran f fh sdgd fsdf d dsg dfg dsg g rtu uyiyuioiu ysiufh asiufhsafhsiafhsauifhasuifhsaifhdsaufhsfhui sdggsg sgfdgsdfg sdfasfdsa fsdf asfasdf asdfasf saf asf sdafasdf sfgsdgsdfgdfsg dsgsdfg dfsgrdstger er tewrt erter t sgfdh er yet ert erwt er gwrwr e erg erlgn erkgherf niheiht iqw huiw hwiue hiuwh tiuh ieu hiuehreiu herui iuerh iweurh wquih fiueh iue hieurh eiruh geui hie iuh iueh ieru hiue iuwe hiueh ih euofhneiuf eiuhe  uer hi  iashui hsu s saf uahfuifh fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    },
    {
        description: "Lana Del Rey",
        title: "comiasdfsdsfgng dh dg  sdg d dsg sd  fast",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    },
    {
        // description: "Babbu Maan",
        title: "Mitran Di Chhatri ajhfdj sadshj s asklfsjka hs josf sdajfoisdjf ioaf sajfiosjf ash ioaj ioh iosfj saioh isofj sioj oiajf oisajf ioasjf ioasfjiosfj sij isj isjf iosafj siaofj siaofjsfajfhsfafuajsfjaifhgfahsou as hasif hsoadf hsaifhsuifh siufh dfg dsg s ds dsfgdfgdfsg dg dsgdf sdg j kuiktutyuyrt uwe hiueh ih euofhneiuf eiuhe  uer hi  iashui hsu s saf uahfuifh fh 9sh",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                    sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                    Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad. sdjfnkjsd sj fdjklj j ksj kdsjg klsdj klsdj odksjg dsiogj oijios jods joisdjg sogjisjgiojg sj iosjsdjio sjdgidsj ijdg iosjgogjoigjdsgljkdfgdsgsj osdj giodjg oisdgj sdogjdio sidgj ds jsdgj oidsjg sidoj sdj dsij sdajfoisdjf ds jods jodsj oisdj oisd
                    sd jsdoi jsdo jod jsdog jsdog jsoi jsdo jsdi jsdgj sdj sd jsdoi joi jdsio gjdso ns ns jo so ms
                    s  j iodj siod jsi jid ji fjo jdio jiojfgdfkg ji
                </p>
            );
        },
    }, {
        description: "Lana Del Rey",
        title: "comiasdfsdsfgng sd sd  sdf g d dsg sd  fast",
        // src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>
            );
        },
    },

];