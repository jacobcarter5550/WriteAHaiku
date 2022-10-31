import { useCookies } from "react-cookie"
import styles from '../../styles/sass/Me.module.scss'
import { useEffect, useState } from "react"
import Link from "next/link"
import { withRouter } from "next/router"

function Haiku({router}) {

    const [ haikus, setHaikus] = useState([])
    const [ cookies, setCookies,] = useCookies(['temp'])

    useEffect(()=>{
        const mapHaikus = cookies.temp.data.map((item)=>{
            const string = JSON.stringify(item)
            if(!string.includes(router.query.haiku)){
                return undefined
            } else {
                return item
            }
        }).filter((item)=> item !== undefined)
        console.log(mapHaikus)
        setHaikus(mapHaikus)
    },[router])


    return (<>
        {haikus[0]?.map((item)=>{
            return <div style={{
                scrollBehavior:'smooth',
                backgroundSize: 'cover', height:'100vh', backgroundRepeat: 'no-repeat',
                overflow:'auto',backgroundImage:`url(${item.img})`, width:'100vw', height:'100vh', alignContent:'center', display:'block'}}>
                    <section style={{marginTop:'30%', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '10px', border: '1.2px solid rgba(255, 255, 255, 0.8)', width:'40%', marginRight:'auto', marginLeft:'auto'}}>
                        <h1 style={{textAlign:'center', textTransform:'capitalize', height:'15%', width:'100%', display:'block'}}>{item.prompt}</h1>
                    </section>
            </div>
        })}
    </>)
}

export default withRouter(Haiku)