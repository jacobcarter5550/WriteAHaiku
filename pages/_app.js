import '../styles/globals.css'
import Head from 'next/head'
import { useState,useEffect } from 'react'
import { useCookies, withCookies } from 'react-cookie';
import CookieHandler from '../components/CookieHandler';

function MyApp({ Component, pageProps }) {

  const [img, setImg] = useState(),
    [closeC, setClose ] = useState(false),
    [cc,setCC] = useState(true)

  const bgC = img !== undefined ?  `background-image: url("${img?.src}");` : 'background: linear-gradient(119.05deg, #E38481 11.24%, #EAB2E6 58.56%, #FCEEED 109.98%);'

  const [cookies, setCookie, removeCookie] = useCookies(['firstVisit'])

  useEffect(()=>{
    setCC(cookies.visited)
  },[])

  return <>
      <Head>
        <meta name="theme-color" content="#231F20"/>
        <link rel="shortcut icon" href="/wh.svg" />
        <meta property="og:image" content='/preview.png' />
        <style>{`html, body{background-size: cover;height:100vh; background-repeat: no-repeat; ${bgC} }`}</style>
      </Head>
      {!cc && <CookieHandler set={setClose} state={closeC} setCook={setCookie} /> }
      <Component {...pageProps} set={setImg}/>
  </>
}

export default MyApp
