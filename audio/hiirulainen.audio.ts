import { ISoundOptions, Scene, Sound } from 'babylonjs';
export class HiirulainenAudio extends Sound {

  constructor(filenameWithoutPath: string, scene: Scene, options?: ISoundOptions) {
    super(filenameWithoutPath, './audio/' + filenameWithoutPath, scene, null, options);
  }
}