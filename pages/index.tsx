import { useRef, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import jsQR from 'jsqr'
import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  const videoRef =  useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrResult, setQrResult] = useState('')

  const onClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        {
          audio: false,
          video: { facingMode: 'environment' }
        }
      )
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      video.onloadedmetadata = () => {
        video.play()
        checkQr()
      }
    } catch (e) {
      console.log('----- error', e)
    }
  }

  const checkQr = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
    if (!imageData) return
    const code = jsQR(imageData.data, canvas.width, canvas.height)

    if (code) {
      console.log('code', code)
      console.log('code.data', code?.data)
      setQrResult(code?.data ?? '')
    } else {
      setTimeout( () => {
        checkQr()
      }, 1000)
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>qr reader sample</title>
        <meta name='description' content='qr reader sample' />
      </Head>
      <main className={styles.main}>
        <button onClick={() => onClick()}>カメラを起動</button>
        <video className={styles.video}  ref={videoRef}></video>
        <canvas className={styles.canvas} ref={canvasRef} />
        {qrResult && <p>結果: {qrResult}</p>}
      </main>
    </div>
  )
}

export default Home
