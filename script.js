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
      updateButton();
    }
  }, stepTime);
}

function updateButton() {
  const playing = !music.paused && music.volume > 0;
  soundIcon.src = playing ? 'assets/unmuted.png' : 'assets/muted.png';
  toggleBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
}

enterBtn.addEventListener('click', () => {
  bgVideo.classList.add('entered');
  entryScreen.classList.add('fade-out');
  fadeAudioIn();

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
  } else {
    music.pause();
  }
  updateButton();
});

volumeSlider.addEventListener('input', () => {
  targetVolume = volumeSlider.value / 100;
  music.volume = targetVolume;
  if (targetVolume > 0 && music.paused && entryScreen.parentNode === null) {
    // Entry already happened; unmuting via slider should resume playback.
    music.play();
  }
  updateButton();
});

music.addEventListener('play', updateButton);
music.addEventListener('pause', updateButton);
