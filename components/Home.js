import axios from 'axios'
import { useState } from 'react'
import { nlpApi } from '../lib/api';
import Head from 'next/head';

function Home({set}) {

    const [val, setV] = useState(),
        [prompts, setPrompts] = useState([]),
        [interval, setInt] = useState(0)

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    async function callLex (prompt) {
        await axios.get(`https://lexica.art/api/v1/search?q=${prompt + '4k'}`).then((resp)=>{ 
            set(resp.data.images[getRandomInt(50)])
        })
    }

    async function doneTyping (prompt, list, inter) {
        var og = list.map((item)=>{return item})
        for (var i = 1; i < list.length - 1; i++) {
            while (list[i].length <= i && typeof list[i + 1]!='undefined' ) {
                list[i] += list[i + 1];
                list.splice(i + 1, 1);
            }
        }
        const combined = list.join('')
        prompt = prompt.replace(combined,'')
        og[og.length] = prompt
        setPrompts(og)
        setInt(interval + 1)
        callLex(prompt, inter)
    }
    
    var typingTimer;               
    var doneTypingInterval = 1200; 

    return (
        <>
            <textarea 
            style={{marginTop: '50px'}}
            onChange={(e)=>{setV(e.target.value)}} 
            onKeyUp={()=>{clearTimeout(typingTimer), typingTimer = setTimeout(() => {
                doneTyping(val, prompts, interval)
            }, doneTypingInterval)}}
            onKeyDown={()=>{clearTimeout(typingTimer)}}
            type="text" />
        </>
    )
}

export default Home