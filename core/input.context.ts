import { Vector3 } from "babylonjs";

let verticalAxis = 0,
    horizontalAxis = 0,
    xTarget = 0,
    zTarget = 0,
    tryJump = false,
    moveVector = Vector3.Zero();
const inputControlsMap = {
    "Down": false,
    "Up": false,
    "Left": false,
    "Right": false,
    "Jump": false
};

export {
    verticalAxis
    , horizontalAxis
    , xTarget, zTarget, tryJump, moveVector,
    inputControlsMap

};

