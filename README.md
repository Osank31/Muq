# Mosquito Game

A fun hand-gesture-based mosquito-swatting game built with React and Vite. Use your webcam and hand gestures to kill as many mosquitoes as you can before the timer runs out!

## Features

- Real-time hand tracking using TensorFlow.js and MediaPipe Hands
- Swat mosquitoes by closing your fist in front of the camera
- Animated UI and sound effects
- Score tracking and replay option

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/Osank31/Muq.git
    cd muq
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the development server:

    ```sh
    npm run dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Gameplay

- Allow camera access when prompted.
- Raise your hand and close your fist to kill mosquitoes.
- Try to get the highest score before the timer ends!
- Click "Play Again" on the score page to restart.

## Project Structure

- `src/` - Main React source code
- `public/` - Static assets (images, sounds)
- `vite.config.js` - Vite configuration

## Credits

- Hand tracking powered by [TensorFlow.js](https://www.tensorflow.org/js) and [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)
- Mosquito and background images generated with AI
- Sound effects from [freesound.org](https://freesound.org/)

---

Enjoy the game!

# About the Working

![](./public/Screenshot%202025-05-13%20124117.png)
![](./public/ChatGPT%20Image%20May%2016,%202025,%2011_15_35%20AM.png)

- Coordinates (0, 0) to (640, 480) rectangle is the game canvas you see on the screen.
- A mosquito spawns initially in one of reigons from (1-8).
  ![](./public/ChatGPT%20Image%20May%2011,%202025,%2009_14_53%20AM.png)
- The final position of mosquito is decided by `getRandomFinal` function in gameUtils.js
