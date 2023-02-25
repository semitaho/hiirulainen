
import * as GUI from 'babylonjs-gui';
import * as BABYLON from 'babylonjs';
import { Scene } from 'babylonjs';

export function createGUI(scene: Scene) {
    var ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui");
    const textBlock = new GUI.TextBlock("score", "0");
    textBlock.color = "yellow";
    textBlock.fontSize = "50";
    textBlock.fontWeight = "bold";
    textBlock.fontFamily = "Verdana";
    textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    textBlock.setPadding("30", "30", null, null);
    ui.addControl(textBlock);
    const textBlock3 = new GUI.TextBlock("omenasaldo", "Omenasaldo: 0");
    textBlock3.color = "black";
    textBlock3.fontSize = "30";
    textBlock3.fontWeight = "bold";
    textBlock3.fontFamily = "Verdana";
    textBlock3.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock3.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock3.setPadding("30", null, "30", "30");
    ui.addControl(textBlock3);

    const textBlock2 = new GUI.TextBlock("hiirulainenPeli", "Hiirulaispeli");
    textBlock2.color = "red";
    textBlock2.fontSize = "50";
    textBlock2.fontWeight = "bold";
    textBlock2.fontFamily = "Verdana";
    textBlock2.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock2.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock2.setPadding("30", null, "30", "30");
    
    const slider=  new GUI.Slider("plaah");
    slider.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    slider.verticalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    
    return {
        scores: textBlock,
        pisteet: 0,
        omenaTekstiBlock: textBlock3,
        ui
    };
}