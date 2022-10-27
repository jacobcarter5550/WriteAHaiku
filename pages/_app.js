import '../styles/globals.css'
import Head from 'next/head'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  const [img, setImg] = useState()
console.log(img?.src)
  return <>
    <Head>
      <style>{`html, body{background-size: cover; background-repeat: no-repeat; background-image: url("${img?.src}"); }`}</style>
    </Head>
    <Component {...pageProps} set={setImg}/>
  </>
}

export default MyApp
