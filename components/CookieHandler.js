import {useState} from 'react'
import { useCookies, withCookies } from 'react-cookie';
import styles from '../styles/sass/Welcome.module.scss'
import Image from 'next/image';

function CookieHandler({set, state, setCook}) {

    return (<>
        {
            state == false ?
                <div className={styles.welcome}>
                    <div className={styles.modal}>
                        <Image src="/wh.svg" alt="" />
                        <h1>Welome to WriteHaiku!</h1>
                        <p>WriteHaiku is easy! Write a line of your Haiku, end it with a comma, and WH will bring you generative art based on your story. You can write as many lines as you want, but once you place add a comma, the line can't be re-written.</p>
                        <p>Once you're ready, just start typing!</p>
                        <br />
                        <p>PS: try getting a perfect 5-7-5 haiku 👀 🎉</p>
                        <button onClick={()=>{setCook('visited', true), set(true)}}>Get Started</button>
                    </div>
                </div>
            :
                <></>
        }
    </>)
}

export default withCookies(CookieHandler)