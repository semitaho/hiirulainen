import * as BABYLON from 'babylonjs';
import { PointerEventTypes, Scalar, Vector3, PickingInfo, Scene, StickValues, Xbox360Dpad, Xbox360Button } from "babylonjs";
import { HiirulainenCamera } from '../core/hiirulainen.camera';
import { Player } from './player';
import { XBOX_STICKVALUE_EPSILON } from '../core/config';

import { inputControlsMap, moveVector } from '../core/input.context';

const gamepadManager = new BABYLON.GamepadManager();

let xTarget = 0, zTarget = 0, horizontal = 0, vertical = 0, xboxEnable = false,
    verticalAxis = 0, horizontalAxis = 0, tryJump = false, tryHit = false;
export function createInputControls(scene: Scene, camera: HiirulainenCamera, player: Player): void {
    scene.preventDefaultOnPointerDown = true;
    scene.preventDefaultOnPointerUp = true;
    const keyboardControlsToActionsMap = {
        "ArrowDown": "Down",
        "ArrowUp": "Up",
        "ArrowRight": "Right",
        "ArrowLeft": "Left",
        " ": "Jump",
        "v": "Hit"
    };

    gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
        xboxEnable = true;

        const xbox360: BABYLON.Xbox360Pad = gamepad as BABYLON.Xbox360Pad;
        xbox360.onButtonDownObservable.add((button: Xbox360Button) => {
            if (button === Xbox360Button.A) {
                inputControlsMap["Jump"] = true;
            } else {
                inputControlsMap["Jump"] = false;

            }
        });


        xbox360.onButtonUpObservable.add(() => {
            inputControlsMap["Jump"] = false;
        });

        xbox360.onleftstickchanged((stickValues: StickValues) => {
            //Button has been pressed
            horizontal = Math.abs(stickValues.x) < XBOX_STICKVALUE_EPSILON ? 0 : stickValues.x;
            vertical = Math.abs(stickValues.y) < XBOX_STICKVALUE_EPSILON ? 0 : -stickValues.y;
            xTarget = horizontal;
            zTarget = vertical;

        });
    });


    scene.onPointerObservable.add((pointerInfo: BABYLON.PointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERDOUBLETAP) {
            inputControlsMap["Jump"] = true;
            xTarget = 0;
            zTarget = 0;
        } else if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            inputControlsMap["Jump"] = false;
            const ray = pointerInfo.pickInfo.ray;
            let hit = scene.pickWithRay(ray);
            if (hit.pickedMesh?.id) {
                xTarget = hit.pickedPoint.x - player.position.x;
                zTarget = hit.pickedPoint?.z - player.position.z;
            }
        }

        else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
            xTarget = 0;
            zTarget = 0;
            inputControlsMap["Jump"] = false;
        } else {
            inputControlsMap["Jump"] = false;
        }
    });

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: ' '
    },
        () => {
            console.log('SPACE button was pressed');
            inputControlsMap["Jump"] = true;
        })
    );

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,
        (event: BABYLON.ActionEvent) => {
            if (!keyboardControlsToActionsMap[event.sourceEvent?.key]) {
                console.warn("keyboard key not mapped: " + event.sourceEvent.key);
                return;
            }
            inputControlsMap[keyboardControlsToActionsMap[event.sourceEvent.key]] = false;
        }));



    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
        (event: BABYLON.ActionEvent) => {
            if (!keyboardControlsToActionsMap[event.sourceEvent?.key]) {
                console.warn("keyboard key not mapped: " + event.sourceEvent.key);
                return;
            }
            inputControlsMap[keyboardControlsToActionsMap[event.sourceEvent.key]] = true;
        }));


    scene.onBeforeRenderObservable.add(() => {

        updateControls();


        const scaleFactor = 0.2;
        let moveVector = new Vector3(horizontal, 0, vertical).normalize().scaleInPlace(scaleFactor);
        const pointerVector = new Vector3(xTarget, 0, zTarget).normalize();
        if (pointerVector.length() > 0) {
            horizontalAxis = pointerVector.x;
            verticalAxis = pointerVector.z;
            moveVector = pointerVector.scaleInPlace(scaleFactor);
        }
        player.mesh.moveWithCollisions(moveVector);
        player.checkJump(tryJump);
        player.checkHit(tryHit);
        player.checkRotation(horizontalAxis, verticalAxis, camera);
        /*
        if (xTarget > 0 || zTarget > 0) {
          moveVector = new Vector3(xTarget, 0, zTarget).normalize().scaleInPlace(0.1);
        }
        console.log('final move vector', moveVector)
        player.fixRotation();
      */
    });
}


function updateControls() {
    const lerpAmount = 0.2;
    const lerpAmountSlow = 0.8;

    if (inputControlsMap["Up"]) {
        vertical = Scalar.Lerp(vertical, 1, lerpAmount);
        verticalAxis = 1;

    } else if (inputControlsMap["Down"]) {
        vertical = Scalar.Lerp(vertical, -1, lerpAmount);
        verticalAxis = -1;
    } else {
        vertical = 0;
        verticalAxis = 0;
    }

    if (inputControlsMap["Left"]) {
        horizontal = Scalar.Lerp(horizontal, -1, lerpAmountSlow);
        horizontalAxis = -1;

    } else if (inputControlsMap["Right"]) {
        horizontal = Scalar.Lerp(horizontal, 1, lerpAmount);
        horizontalAxis = 1;
    }
    else {
        horizontal = 0;
        horizontalAxis = 0;
    }

    if (inputControlsMap["Hit"]) {
        console.log('ill hit...');
        tryHit = true;
    } else {
        tryHit = false;
    }

    if (inputControlsMap["Jump"]) {
        tryJump = true;
    } else {
        tryJump = false;
    }
}