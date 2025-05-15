function getHandedness(handedness) {
    if (handedness === 'Left') return 'Right';
    return 'Left';
}

function getHandState(keypoints, handedness) {
    let answer = 'Open';
    let [thumb, indexFinger, ringFinger, middleFinger, littleFinger] = [
        false,
        false,
        false,
        false,
        false,
    ];

    if (keypoints[8].y > keypoints[5].y) {
        indexFinger = true;
    }
    if (keypoints[12].y > keypoints[9].y) {
        middleFinger = true;
    }
    if (keypoints[16].y > keypoints[13].y) {
        ringFinger = true;
    }
    if (keypoints[20].y > keypoints[17].y) {
        littleFinger = true;
    }

    if (handedness === 'Right') {
        if (keypoints[4].x < keypoints[2].x) {
            thumb = true;
        }
    } else if (handedness === 'Left') {
        if (keypoints[4].x > keypoints[2].x) {
            thumb = true;
        }
    }

    if (indexFinger && middleFinger && ringFinger && littleFinger && thumb) {
        answer = 'Closed';
    }

    return answer;
}

export { getHandState, getHandedness };
