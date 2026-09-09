const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const volumeSlider = document.getElementById('volume-slider');
const enterBtn = document.getElementById('enter-btn');
const entryScreen = document.getElementById('entry-screen');
const bgVideo = document.getElementById('bg-video');

let targetVolume = volumeSlider.value / 100;
const FADE_MS = 1400;

function fadeAudioIn(duration = FADE_MS) {
  music.volume = 0;
  music.play().catch(() => {});
  const steps = 30;
  const stepTime = duration / steps;
  let i = 0;
  const interval = setInterval(() => {
    i++;
    music.volume = Math.min(targetVolume, (targetVolume * i) / steps);
    if (i >= steps) {
      clearInterval(interval);
    }
  }, stepTime);
}

function setIcon(muted) {
  soundIcon.src = muted ? 'assets/muted.png' : 'assets/unmuted.png';
  toggleBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
}

enterBtn.addEventListener('click', () => {
  bgVideo.classList.add('entered');
  entryScreen.classList.add('fade-out');
  fadeAudioIn();
  // Icon intentionally untouched here — stays on whatever it was showing.

  entryScreen.addEventListener('transitionend', () => {
    entryScreen.remove();
  }, { once: true });
});

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (music.paused || music.volume === 0) {
    music.play();
    music.volume = targetVolume > 0 ? targetVolume : 0.5;
    volumeSlider.value = Math.round(music.volume * 100);
    setIcon(false);
  } else {
    music.pause();
    setIcon(true);
  }
});

volumeSlider.addEventListener('input', () => {
  targetVolume = volumeSlider.value / 100;
  music.volume = targetVolume;
  if (targetVolume > 0 && music.paused && entryScreen.parentNode === null) {
    // Entry already happened; unmuting via slider should resume playback.
    music.play();
  }
  setIcon(targetVolume === 0);
});
