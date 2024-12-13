import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import useKeyPress from './useKeyPress';
import styles from '../styles/sass/Home.module.scss'
import nlp from 'compromise'
import speechPlugin from 'compromise-speech'
import confetti from 'canvas-confetti'
const { Configuration, OpenAIApi } = require("openai");
import { useCookies } from 'react-cookie';
import { v4 } from 'uuid'
import SignUp from './SignUp';
import { magic } from '../lib/magic';
import { updateCookies } from '../lib/api';
import Link from 'next/link';

const aiKey =  process.env.NEXT_PUBLIC_AI_KEY

function Home({set}) {
    const configuration = new Configuration({
        apiKey: aiKey,
    });
    const openai = new OpenAIApi(configuration);

    nlp.plugin(speechPlugin)

    const [val, setV] = useState(),
    [prompts, setPrompts] = useState([]),
    [syllables, setSylls] = useState([]),
    [imgs, setImgs] = useState([]),
    [def, setDef] = useState(),
    [sign, setSign] = useState(false),
    [areHaikus, setAre ] = useState (false)

    console.log(val)
    const [cookies, setCookies, removeCookies] = useCookies(['temp'])

    const inpRef = useRef()

    async function getHaiku () {
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: "Write the one line of a haiku:",
            temperature: 0.6,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        setDef(response.data.choices[0].text.split('\n')[4])
    }

    async function callLex (prompt) {
        await axios.get(`https://lexica.art/api/v1/search?q=${prompt + '4k'}`).then((resp)=>{ 
            const num = Math.floor(Math.random() * 50)
            set(resp.data.images[num])
            setImgs([...imgs, resp.data.images[num].src])
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

    
    useEffect(()=>{
        inpRef.current.focus()
        if(def== undefined) {
            console.log('there')
            getHaiku()
        }
        cookies.temp?.data.length > 0 ? setAre(true) : setAre(false)
    },[])

    useEffect(()=>{
        var duration = 15 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }
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

    function save () {
        const temp = cookies.temp
        // if(temp.data.length == 3) {
        //     setSign(true)
        //     return
        // }

        const data = prompts.map((item,ind)=>{return {prompt: item, img:imgs[ind]}})
        const isPass = temp.data.map((item)=>{
            if (JSON.stringify(item) == JSON.stringify(data)) {
                return 1
            } else {return 0}
        }).reduce((y, a) => y + a, 0)

        if(isPass == 0 ){
            setCookies('temp', {id:temp.id, data: [...temp.data, data]})    
        } else {} 
        setImgs([]), set(), setPrompts([]), setSylls([])
    }

    return (<>
        {sign && <SignUp />}
        <div className={styles.home}>
            <div className={styles.area}>
                <aside className={styles.prompts}>
                    {prompts.map((item, ind)=>{
                        return <p key={ind}>{item}</p>
                    })}
                    {prompts == '' && <p style={{color :inpRef.current?.value == '' ? '' : 'rgba(0,0,0,.4)'}} onClick={()=>{inpRef.current.value = def}}>{def}...</p> }
                </aside>
                <section className={styles.typingModal}>
                    <textarea  autoFocus ref={inpRef}
                    onChange={(e)=>{setV(e.target.value)}} 
                    type="text" />
                </section>
                <div className={styles.commands}>
                    {areHaikus ? <Link href='/me'>My Haikus</Link> : <p style={{opacity:'50%'}} >My Haikus</p>}
                    <button onClick={()=>{save()}}>Save!</button>
                    {/* <button onClick={()=>{console.log(cookies.temp)}}>test!</button> */}
                </div>
            </div>
        </div>
    </>)
}

export default Home