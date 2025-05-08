import React from 'react'
import MusquitoImage from '/pngtree-cartoon-mosquito-png-image_4031335-removebg-preview.png'

const IntroPage = () => {
  return (
    <div className='bg-blue-700'>
        <h1 className="text-xl font-extrabold tracking-wide m-12 text-gray-100">The Musquito Game</h1>
        <img src={MusquitoImage} alt="" />
        <div class="mx-3 text-gray-100 font-bold" id="Rules">
            <h1 class="text-3xl">Rules:-</h1>
            <ul class="text-xl list-disc">
                <li class="my-6">Give access to your webcam</li>
                <li class="my-6">Raise your hand for the system to detect hands</li>
                <li class="my-6">Make sure you have good lighting</li>
                <li class="my-6">Close your fist to kill musquitos</li>
                <li class="my-6">Score as many points as you can!!!</li>
            </ul>
        </div>
        <button class="bg-orange-500 hover:bg-orange-600 text-white font-bold border-orange-500 rounded-lg p-4 text-xl" onClick={playGame}>Lets Play</button>
    </div>
  )
}

export default IntroPage