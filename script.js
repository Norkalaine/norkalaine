const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('sound-toggle');
const enterBtn = document.getElementById('enter-btn');
const entryScreen = document.getElementById('entry-screen');
const bgVideo = document.getElementById('bg-video');

const TARGET_VOLUME = 0.5;
const FADE_MS = 1400;

function fadeAudioIn(duration = FADE_MS) {
  music.volume = 0;
  music.play().catch(() => {});
  const steps = 30;
  const stepTime = duration / steps;
  let i = 0;
  const interval = setInterval(() => {
    i++;
    music.volume = Math.min(TARGET_VOLUME, (TARGET_VOLUME * i) / steps);
    if (i >= steps) {
      clearInterval(interval);
      updateButton();
    }
  }, stepTime);
}

function updateButton() {
  const playing = !music.paused;
  toggleBtn.textContent = playing ? '🔊' : '🔇';
  toggleBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
}

enterBtn.addEventListener('click', () => {
  // Unblur the video
  bgVideo.classList.add('entered');
  // Fade out the entry overlay
  entryScreen.classList.add('fade-out');
  // Fade the music in
  fadeAudioIn();

  entryScreen.addEventListener('transitionend', () => {
    entryScreen.remove();
  }, { once: true });
});

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (music.paused) {
    music.play();
    // Snap to target volume if resuming after an explicit mute.
    music.volume = TARGET_VOLUME;
  } else {
    music.pause();
  }
  updateButton();
});

music.addEventListener('play', updateButton);
music.addEventListener('pause', updateButton);
