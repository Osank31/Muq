function getRandomInterval(min = 1000, max = 5000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function callFunctionRandomly(fn, min = 1000, max = 5000) {
  function scheduleNext() {
    const interval = getRandomInterval(min, max);
    setTimeout(() => {
      fn();
      scheduleNext();
    }, interval);
  }
  scheduleNext();
}

export { callFunctionRandomly };

// Example usage (remove or comment out in production):
// callFunctionRandomly(() => {
//   console.log('Function called at random interval!');
// });