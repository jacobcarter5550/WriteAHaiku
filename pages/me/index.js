import { useCookies } from "react-cookie"
import styles from '../../styles/sass/Me.module.scss'
import { useEffect, useState } from "react"
import Link from "next/link"

function Index() {
    
    const [cookies, setCookies,] = useCookies(['temp']),
    [haikus, setHaikus] = useState([])

    useEffect(()=>{
        setHaikus(cookies.temp.data)
    },[])



    return (<>
        <div className={styles.me}>
            <div className={styles.area}>
                <Link href='/'> ←Write a Haiku</Link>
                <section style={{marginTop:'5px'}} className={styles.articles}>
                    {haikus.map((item,ind)=>{
                        return <Link key={ind} href={`/me/${item[0].prompt}`}>
                            <h3>{item[0].prompt}</h3>
                            <img src={item[0].img} alt="" />
                        </Link>
                    })}
                </section>
            </div>
        </div>
    </>)
}

export default Index