import React, { useRef, useEffect } from 'react'
import mosquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png'

const Test2 = () => {
    const canvasRef = useRef(null)
    const imageRef = useRef(null)
    
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const img = imageRef.current
        
        
        if (img.complete) {
            console.log(imageRef.current.width/imageRef.current.height)
            ctx.drawImage(img, 100, 100, 200, 200/1.5)
        } else {
            img.onload = () => {
                ctx.drawImage(img, 100, 100, 200, 200/1.5)
            }
        }
    }, [])
    
    return (
        <div>
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{ border: '2px solid black' }}
            />
            <img src={mosquitoImage} ref={imageRef} style={{ display: 'none' }} alt="mosquito" />
        </div>
    )
}

export default Test2