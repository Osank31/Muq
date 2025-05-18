import React from 'react';
import Test from './Test.jsx';
import IntroPage from './IntroPage.jsx';
import GamePage from './GamePage.jsx';
import CamNotAllowed from './CamNotAllowed.jsx';
import DeviceCheck from './DeviceCheck.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <>
            <DeviceCheck>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<IntroPage />} />
                        <Route path='/game' element={<GamePage />} />
                        <Route path='/test' element={<Test />} />
                        <Route path='/cam-denied' element={<CamNotAllowed />} />
                    </Routes>
                </BrowserRouter>
            </DeviceCheck>
        </>
    );
}

export default App;
