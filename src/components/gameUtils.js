const handleOnComplete = () => {
    // Timer complete handler
};

const getRandom = (a, b) => {
    return Math.floor(Math.random() * (b - a + 1)) + a;
};

function getRandomFromIntervals(intervals) {
    if (!Array.isArray(intervals) || intervals.length === 0) {
        throw new Error('Intervals must be a non-empty array');
    }
    const intervalIndex = Math.floor(Math.random() * intervals.length);
    const [min, max] = intervals[intervalIndex];

    if (min > max) {
        throw new Error(`Invalid interval: [${min}, ${max}]`);
    }
    return Math.floor(Math.random() * (max - min) + min);
}

const getRandomInitial = (canvasWidth, canvasHeight, dx, dy) => {
    let n = Math.floor(Math.random() * (8 - 1 + 1) + 1);
    switch (n) {
        case 1:
            var x = getRandom(-dx, 0);
            var y = getRandom(-dy, 0);
            return [x, y, n];
        case 2:
            var x = getRandom(-dx, 0);
            var y = getRandom(0, canvasHeight);
            return [x, y, n];
        case 3:
            var x = getRandom(-dx, 0);
            var y = getRandom(canvasHeight, canvasHeight + dy);
            return [x, y, n];
        case 4:
            var x = getRandom(0, canvasWidth);
            var y = getRandom(canvasHeight, canvasHeight + dy);
            return [x, y, n];
        case 5:
            var x = getRandom(canvasWidth, canvasWidth + dx);
            var y = getRandom(canvasHeight, canvasHeight + dy);
            return [x, y, n];
        case 6:
            var x = getRandom(canvasWidth, canvasWidth + dx);
            var y = getRandom(0, canvasHeight);
            return [x, y, n];
        case 7:
            var x = getRandom(canvasWidth, canvasWidth + dx);
            var y = getRandom(-dy, 0);
            return [x, y, n];
        case 8:
            var x = getRandom(0, canvasWidth);
            var y = getRandom(-dy, 0);
            return [x, y, n];
    }
};

const getRandomFinal = (canvasWidth, canvasHeight, dx, dy, n) => {
    switch (n) {
        case 1:
            var n2 = getRandom(4, 6);
            switch (n2) {
                case 4:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 5:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 6:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
            }
            break;
        case 2:
            var n2 = getRandom(4, 8);
            switch (n2) {
                case 4:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 5:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 6:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 7:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
                case 8:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
            }
            break;
        case 3:
            var n2 = getRandom(6, 8);
            switch (n2) {
                case 6:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 7:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
                case 8:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
            }
            break;
        case 4:
            var n2 = getRandomFromIntervals([
                [6, 8],
                [1, 2],
            ]);
            switch (n2) {
                case 1:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
                case 2:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 6:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 7:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
                case 8:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
            }
            break;
        case 5:
            var n2 = getRandomFromIntervals([
                [1, 2],
                [8, 8],
            ]);
            switch (n2) {
                case 1:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
                case 2:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 8:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
            }
            break;
        case 6:
            var n2 = getRandomFromIntervals([
                [1, 4],
                [8, 8],
            ]);
            switch (n2) {
                case 1:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
                case 2:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 3:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 4:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 8:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(-dy, 0);
                    return [x, y, n2];
            }
            break;
        case 7:
            var n2 = getRandom(2, 4);
            switch (n2) {
                case 2:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 3:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 4:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
            }
            break;
        case 8:
            var n2 = getRandom(2, 6);
            switch (n2) {
                case 2:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
                case 3:
                    var x = getRandom(-dx, 0);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 4:
                    var x = getRandom(0, canvasWidth);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 5:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(canvasHeight, canvasHeight + dy);
                    return [x, y, n2];
                case 6:
                    var x = getRandom(canvasWidth, canvasWidth + dx);
                    var y = getRandom(0, canvasHeight);
                    return [x, y, n2];
            }
            break;
        default:
            return [640, 480, -1];
    }
};

const calculateAngle = (x1, y1, x2, y2) => {
    let theta = Math.atan2(y2 - y1, x2 - x1);
    return theta;
};

const camHandCoordinatesToGameHandCoordinates = (
    x,
    y,
    camSize = [1280, 720],
    gameSize = [640, 480]
) => {
    let [x1, y1] = camSize;
    let [x2, y2] = gameSize;

    let _x = (x1 - x2) / 2;
    let _y = (y1 - y2) / 2;

    return [x - _x, y - _y];
};

const getIncenter = ([x1, y1], [x2, y2], [x3, y3]) => {
    let a, b, c;
    a = Math.hypot(y3 - y2, x3 - x2);
    b = Math.hypot(x3 - x1, y3 - y1);
    c = Math.hypot(y2 - y1, x2 - x1);

    return [(a * x1 + b * x2 + c * x3) / (a + b + c), (a * y1 + b * y2 + c * y3) / (a + b + c)];
};

function getRandomInterval(min = 1000, max = 5000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function callFunctionRandomly(fn, min = 100, max = 5000) {
    function scheduleNext() {
        const interval = getRandomInterval(min, max);
        setTimeout(() => {
            fn();
            scheduleNext();
        }, interval);
    }
    scheduleNext();
}

export {
    handleOnComplete,
    getRandom,
    getRandomFromIntervals,
    getRandomInitial,
    getRandomFinal,
    calculateAngle,
    camHandCoordinatesToGameHandCoordinates,
    getIncenter,
    callFunctionRandomly
};
