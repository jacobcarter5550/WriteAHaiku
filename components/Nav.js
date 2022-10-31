import { useState, useEffect } from 'react'
import styles from '../styles/sass/Nav.module.scss'

function Nav() {

    const [ n, setN ] = useState(true)

    useEffect(()=>{
        n == false ? document.documentElement.style.setProperty('--opacity',0) : document.documentElement.style.setProperty('--opacity',100)

    },[n])

    useEffect(()=>{
        setTimeout(() => {
            setN(!n)
        }, 5000);
    },[])

    function setVis() {
        setN(!n)
    }

    return (
        <div onMouseLeave={setVis} onMouseOver={setVis} className={styles.nav}>
            <img className={styles.logo} src='/wh.svg' />
            <section className={styles.pf}>
                {/* <img src='https://pbs.twimg.com/profile_images/1387160457404813315/D7dFeGh-_400x400.jpg'/> */}
            </section>
        </div>
    )
}

export default Nav