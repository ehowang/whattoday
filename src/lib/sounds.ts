import { Howl } from "howler";

let leverSound: Howl | null = null;
let spinSound: Howl | null = null;
let winSound: Howl | null = null;

function ensureLoaded() {
  if (leverSound) return;

  leverSound = new Howl({
    src: ["/sounds/lever.mp3"],
    volume: 0.5,
  });

  spinSound = new Howl({
    src: ["/sounds/spin.mp3"],
    volume: 0.3,
    loop: true,
  });

  winSound = new Howl({
    src: ["/sounds/win.mp3"],
    volume: 0.6,
  });
}

export const sounds = {
  lever() {
    ensureLoaded();
    leverSound?.play();
  },
  startSpin() {
    ensureLoaded();
    spinSound?.play();
  },
  stopSpin() {
    spinSound?.stop();
  },
  win() {
    ensureLoaded();
    winSound?.play();
  },
};
