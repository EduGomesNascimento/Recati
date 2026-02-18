(() => {
  const video = document.querySelector(".mascot-video");
  if (!video) return;

  const PAUSE_MS = 10000;
  let waiting = false;

  video.loop = false;

  const playAgain = () => {
    if (waiting) return;
    waiting = true;
    window.setTimeout(() => {
      video.currentTime = 0;
      video.play().catch(() => {});
      waiting = false;
    }, PAUSE_MS);
  };

  video.addEventListener("ended", playAgain);
})();
