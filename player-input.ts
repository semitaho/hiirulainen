import { ActionEvent, ActionManager, ExecuteCodeAction, Mesh, Quaternion, Scalar, Scene, Vector3 } from "babylonjs";
import { Player } from "./prefabs/player";

export class PlayerInput {

  public inputMap: any;

  private _scene: Scene;

  //simple movement
  public horizontal: number = 0;
  public vertical: number = 0;
  //tracks whether or not there is movement in that axis
  public horizontalAxis: number = 0;
  public verticalAxis: number = 0;
  public jumpKeyDown: boolean = false;
  public jumpCount = 0;

  public moveDirection: Vector3;

  constructor(scene: Scene) {
    this._scene = scene;
    //scene action manager to detect inputs

    this.inputMap = {};
    this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt: ActionEvent) => {

      this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt: ActionEvent) => {
      this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      if (evt.sourceEvent.key === " ") {

        this.jumpCount = 0;
      }
    }));
    //add to the scene an observable that calls updateFromKeyboard before rendering
    scene.onBeforeRenderObservable.add(() => {
      this._updateFromKeyboard();
    });

  }
  private _updateFromKeyboard() {
    const rotationAmount = 0.3;
    const speedAmount = 0.5;
    
    if (this.inputMap["ArrowUp"]) {
      this.vertical = Scalar.Lerp(this.vertical, speedAmount, 0.1);
      this.verticalAxis = 1;

    } else if (this.inputMap["ArrowDown"]) {
      this.vertical = Scalar.Lerp(this.vertical, -speedAmount, 0.1);
      this.verticalAxis = -1;
    } else {
      this.vertical = 0;
      this.verticalAxis = 0;
    }

    if (this.inputMap["ArrowLeft"]) {
      this.horizontal = Scalar.Lerp(this.horizontal, -rotationAmount, 0.1);
      this.horizontalAxis = -1;

    } else if (this.inputMap["ArrowRight"]) {
      this.horizontal = Scalar.Lerp(this.horizontal, rotationAmount, 0.1);
      this.horizontalAxis = 1;
    }
    else {
      this.horizontal = 0;
      this.horizontalAxis = 0;
    }
    this.moveDirection =  new Vector3(this.horizontal, 0, this.vertical); //this._moveDirection.scaleInPlace(this._inputAmt * Player.PLAYER_SPEED);
    this.moveDirection = this.moveDirection.scaleInPlace(0.2);
  
  }
}