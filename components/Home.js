import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import useKeyPress from './useKeyPress';
import styles from '../styles/sass/Home.module.scss'
import nlp from 'compromise'
import speechPlugin from 'compromise-speech'
import confetti from 'canvas-confetti'

function Home({set}) {

    nlp.plugin(speechPlugin)

    const [val, setV] = useState(),
        [prompts, setPrompts] = useState([]),
        [syllables, setSylls] = useState([])

    const inpRef = useRef()

    async function callLex (prompt) {
        await axios.get(`https://lexica.art/api/v1/search?q=${prompt + '4k'}`).then((resp)=>{ 
            set(resp.data.images[Math.floor(Math.random() * 50)])
        })
    }

    function breakCallCheck({ prompts, setPrompts, val, inpRef}){
        if(val){
            setPrompts([...prompts, val])
            callLex(val)
            console.log(nlp(val).terms().syllables().map((arr)=>{return arr.length}).reduce((y, x) => y + x, 0))
            setSylls([...syllables, nlp(val).terms().syllables().map((arr)=>{return arr.length}).reduce((y, x) => y + x, 0)])
            inpRef.current.value = ""
        }
    }

    useKeyPress('Comma', breakCallCheck, { prompts, setPrompts, val, inpRef})

    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    useEffect(()=>{
        inpRef.current.focus()
    },[])

    useEffect(()=>{
        if(syllables[0] && syllables[0]==5) {
            if(syllables[1] && syllables[1]==7) {
                if(syllables[2] && syllables[2]==5) {
                    setInterval(function() {
                        var timeLeft = animationEnd - Date.now();
                        if (timeLeft <= 0) {return clearInterval();}
                        var particleCount = 50 * (timeLeft / duration);
                        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                    }, 250)
                }
            }
        }
    },[syllables])

    return (
        <div className={styles.home}>
            {prompts.map((item)=>{
                return <p>{item}</p>
            })}
            <section className={styles.typingModal}>
                <textarea  autoFocus ref={inpRef}
                onChange={(e)=>{setV(e.target.value)}} 
                type="text" />
            </section>
        </div>
    )
}

export default Home