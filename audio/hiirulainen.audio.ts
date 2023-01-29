import { ISoundOptions, Scene, Sound } from 'babylonjs';
export class HiirulainenAudio extends Sound {

  constructor(filenameWithoutPath: string, scene: Scene, callbackReady: () => void, options?: ISoundOptions) {
    super(filenameWithoutPath, './audio/' + filenameWithoutPath, scene, callbackReady, options);
  }
}