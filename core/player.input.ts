import * as BABYLON from 'babylonjs';
import { PointerEventTypes, Scalar, Vector3, PickingInfo, Scene } from "babylonjs";
import { HiirulainenCamera } from '../prefabs/hiirulainen.camera';
import { Player } from '../prefabs/player';

import { inputControlsMap, moveVector } from './input.context';

let xTarget = 0, zTarget = 0, horizontal = 0, vertical = 0,
    verticalAxis = 0, horizontalAxis = 0, tryJump = false;
export function createInputControls(scene: Scene, camera: HiirulainenCamera, player: Player): void {
    scene.preventDefaultOnPointerDown = true;
    scene.preventDefaultOnPointerUp = true;
    const keyboardControlsToActionsMap = {
        "ArrowDown": "Down",
        "ArrowUp": "Up",
        "ArrowRight": "Right",
        "ArrowLeft": "Left",
        " ": "Jump"
    };

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

    if (inputControlsMap["Jump"]) {
        tryJump = true;
    } else {
        tryJump = false;
    }
}