import { ISoundOptions, Scene } from "babylonjs";
import { HiirulainenAudio } from "./hiirulainen.audio";



export function loadAudio(scene: Scene): void {
    createHiirulainenAudio("tunetank.mp3", scene, {
        volume: 0.2, autoplay: false, loop: true
    }).then((audio: HiirulainenAudio) => audio.play());

    startLaskeminen(scene);
}
function createHiirulainenAudio(filenameWithoutPath: string, scene: Scene, options: ISoundOptions): Promise<HiirulainenAudio> {
    return new Promise((resolve, _) => {
        const hiirulainenAudio = new HiirulainenAudio(filenameWithoutPath, scene, () => {
            resolve(hiirulainenAudio);
        }, options);
    });
}


function afterAudioPlayedCreateNewPlayeable(audio: HiirulainenAudio, newAudioPromise: Promise<HiirulainenAudio>): Promise<HiirulainenAudio> {
    return new Promise(resolve => {
        audio.onEndedObservable.add(() => {
            resolve(newAudioPromise);
        });

    });

}

function startLaskeminen(scene: Scene) {
    createHiirulainenAudio("Yksi.m4a", scene, {
        loop: false,
        volume: 0.6
    }).then((audio: HiirulainenAudio) => {
        audio.play(2);
        return afterAudioPlayedCreateNewPlayeable(
            audio,
            createHiirulainenAudio("Kaksi.m4a", scene, null));
    }).then((newAudio: HiirulainenAudio) => {
        newAudio.play(1);
        return afterAudioPlayedCreateNewPlayeable(newAudio,
            createHiirulainenAudio("Kolme.m4a", scene, null));
    }).then((newAudio: HiirulainenAudio) => {
        newAudio.play(1);
        return afterAudioPlayedCreateNewPlayeable(newAudio,
            createHiirulainenAudio("Nelja.m4a", scene, null));
    }).then((newAudio: HiirulainenAudio) => {
        newAudio.play(1);
        return afterAudioPlayedCreateNewPlayeable(newAudio,
            createHiirulainenAudio("Viisi.m4a", scene, {
                volume: 0.4
            }));
    }).then((newAudio: HiirulainenAudio) => {
        newAudio.play(1);
        return afterAudioPlayedCreateNewPlayeable(newAudio,
            createHiirulainenAudio("Tullaan.m4a", scene, null));
    }).then((newAudio: HiirulainenAudio) => {
        newAudio.play(2);
    });
}