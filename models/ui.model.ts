import { AdvancedDynamicTexture, Slider, TextBlock } from "babylonjs-gui";

export interface UIModel {
  ui: AdvancedDynamicTexture,
  scores: TextBlock,
  pisteet: number,
  slider: Slider,
  omenaTekstiBlock: TextBlock;

}