(() => {
  const VIDEO_SRC = "./Gatinho_Pendurado_na_Borda_Preta_RS.mp4";
  const VIDEO_FALLBACK_SRC = "./Gatinho_Pendurado_na_Borda_Preta.mp4";
  const START_TIME = 0.12;
  const FREEZE_TIME = 7.0;
  const SCROLL_SLOP = 0.02;
  const SEEK_FPS = 20;
  const SMOOTH_RESPONSE = 6.8;
  const VIDEO_SCALE = 0.86;
  const BLACK_BAND_START_AT_BEGIN = 0.9;
  const BLACK_BAND_START_AT_END = 0.702;
  const MIN_TIME_STEP = 1 / 24;
  const END_LOCK_SCROLL = 0.985;
  const END_ZONE_START = 0.9;
  const SEEK_STALL_RESET_MS = 280;
  const BG_SAMPLE_H = 24;
  const BG_SAMPLE_W_RATIO = 0.16;
  const EDGE_OVERLAP_PX = 2;
  const TOP_CORNER_SAMPLE_RATIO = 0.14;

  const enterBtn = document.getElementById("enterAccessBtn");
  const skipBtn = document.getElementById("skipIntroBtn");
  const gate = document.getElementById("gate");
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  let lockRafId = null;
  const INTRO_VIEWS_KEY = "recati_intro_views";
  const params = new URLSearchParams(window.location.search);
  const skipIntroParam = params.get("skipIntro") === "1";
  const introViews = Number.parseInt(localStorage.getItem(INTRO_VIEWS_KEY) || "0", 10) || 0;

  if (enterBtn && intro) {
    if (skipBtn && introViews >= 2) {
      skipBtn.classList.remove("is-hidden");
    }

    const skipIntroNow = () => {
      document.body.classList.remove("gate-locked");
      if (lockRafId) {
        cancelAnimationFrame(lockRafId);
        lockRafId = null;
      }
      if (gate) gate.style.display = "none";
      if (intro) intro.style.display = "none";
      setReadyState(true);
      if (site) {
        site.style.visibility = "visible";
        site.style.opacity = "1";
        site.style.transform = "translateY(0)";
      }
      window.scrollTo({ top: 0, behavior: "auto" });
      if (site) site.scrollIntoView({ behavior: "auto", block: "start" });
    };

    if (skipIntroParam) {
      skipIntroNow();
    } else {
      document.body.classList.add("gate-locked");
    }

    const keepTop = () => {
      if (!document.body.classList.contains("gate-locked")) {
        lockRafId = null;
        return;
      }
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      lockRafId = requestAnimationFrame(keepTop);
    };

    if (!skipIntroParam) {
      window.scrollTo(0, 0);
      keepTop();
    }

    enterBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      localStorage.setItem(INTRO_VIEWS_KEY, String(introViews + 1));
      document.body.classList.remove("gate-locked");
      if (lockRafId) {
        cancelAnimationFrame(lockRafId);
        lockRafId = null;
      }
      intro.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (skipBtn) {
      skipBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        const base = `${window.location.pathname}?skipIntro=1`;
        window.location.href = base;
      });
    }
  }

  const video = document.createElement("video");
  video.src = VIDEO_SRC;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  let vw = 0;
  let vh = 0;
  let initialized = false;
  let targetTime = 0;
  let smoothTime = 0;
  let rafId = null;
  let lastTick = 0;
  let lastSeekAt = 0;
  let lastRequestedTime = -1;
  let seekBusy = false;
  let queuedTime = null;
  let hasRVFC = false;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function setReadyState(isReady) {
    document.body.classList.toggle("site-ready", isReady);
  }

  function getPageProgress() {
    const rect = intro.getBoundingClientRect();
    const total = intro.offsetHeight - window.innerHeight;
    const scrolled = clamp(-rect.top, 0, total);
    return total > 0 ? scrolled / total : 0;
  }

  function drawFrame() {
    if (!video.videoWidth || !video.videoHeight) return;
    if (video.readyState < 2) return;

    const cw = vw;
    const ch = vh;
    const iw = video.videoWidth;
    const ih = video.videoHeight;

    const scale = Math.min(cw / iw, ch / ih) * VIDEO_SCALE;
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;

    ctx.fillStyle = "#c7c7c7";
    ctx.fillRect(0, 0, cw, ch);

    const sideW = Math.max(0, Math.floor(dx));
    const rightX = Math.ceil(dx + sw);
    const rightW = Math.max(0, cw - rightX);
    const topH = Math.max(0, Math.ceil(dy));
    const sampleW = Math.max(2, Math.floor(iw * BG_SAMPLE_W_RATIO));
    const cornerW = Math.max(2, Math.floor(iw * TOP_CORNER_SAMPLE_RATIO));
    const overlap = EDGE_OVERLAP_PX;

    if (sideW > 0) {
      ctx.drawImage(video, 0, 0, sampleW, BG_SAMPLE_H, 0, 0, sideW + overlap, ch);
    }

    if (rightW > 0) {
      ctx.drawImage(video, iw - sampleW, 0, sampleW, BG_SAMPLE_H, rightX - overlap, 0, rightW + overlap, ch);
    }

    if (topH > 0) {
      // Fill top gap using only corner strips to avoid ear artifacts near the center.
      const destX = Math.floor(dx) - overlap;
      const destW = Math.ceil(sw) + overlap * 2;
      const halfW = Math.ceil(destW / 2);
      ctx.drawImage(video, 0, 0, cornerW, BG_SAMPLE_H, destX, 0, halfW, topH);
      ctx.drawImage(video, iw - cornerW, 0, cornerW, BG_SAMPLE_H, destX + halfW, 0, destW - halfW, topH);
    }

    ctx.drawImage(video, dx, dy, sw, sh);

    // Keep bar motion tied to smoothed progress so it doesn't freeze on decode stalls.
    const progress = clamp(smoothTime / FREEZE_TIME, 0, 1);
    const rise = Math.pow(progress, 0.62);
    const barStartRatio = lerp(BLACK_BAND_START_AT_BEGIN, BLACK_BAND_START_AT_END, rise);
    const bandY = Math.floor(dy + sh * barStartRatio);
    if (bandY < ch) {
      const safeBandY = Math.max(0, bandY);
      // Solid black fill avoids vertical stripe artifacts from stretched rows.
      ctx.fillStyle = "#000";
      ctx.fillRect(0, safeBandY, cw, ch - safeBandY);

      // Cover potential 1px seam between video bar and background bar.
      ctx.fillRect(0, Math.max(0, safeBandY - 1), cw, 1);
    }
  }

  function resizeCanvas() {
    vw = window.innerWidth;
    vh = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(vw * dpr);
    canvas.height = Math.floor(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame();
  }

  function seekToTime(time, nowMs) {
    if (!initialized) return;

    const safeDuration = Number.isFinite(video.duration) ? video.duration : FREEZE_TIME;
    const nextTime = clamp(time, START_TIME, Math.min(FREEZE_TIME, safeDuration));
    const minSeekInterval = 1000 / SEEK_FPS;

    if (Math.abs(lastRequestedTime - nextTime) <= MIN_TIME_STEP * 0.5) return;
    if (Math.abs(video.currentTime - nextTime) <= MIN_TIME_STEP * 0.5) return;

    // Serialize seeks to avoid decode thrash near the end.
    if (seekBusy || video.seeking || nowMs - lastSeekAt < minSeekInterval) {
      queuedTime = nextTime;
      return;
    }

    seekBusy = true;
    lastSeekAt = nowMs;
    lastRequestedTime = nextTime;
    try {
      video.currentTime = nextTime;
    } catch {
      seekBusy = false;
    }
  }

  function updateTargetFromScroll() {
    const p = getPageProgress();
    const eased = p < END_ZONE_START
      ? 1 - Math.pow(1 - p, 1.2)
      : 1 - Math.pow(1 - p, 2.2);
    const mapped = clamp(START_TIME + eased * (FREEZE_TIME - START_TIME), START_TIME, FREEZE_TIME);
    targetTime = p >= END_LOCK_SCROLL ? FREEZE_TIME : mapped;
  }

  function loop(nowMs) {
    if (initialized) {
      if (seekBusy && nowMs - lastSeekAt > SEEK_STALL_RESET_MS) {
        seekBusy = false;
      }

      updateTargetFromScroll();

      const dt = lastTick ? Math.min((nowMs - lastTick) / 1000, 0.1) : 1 / 60;
      lastTick = nowMs;

      // Exponential smoothing for a fluid scrub in both directions.
      const alpha = 1 - Math.exp(-SMOOTH_RESPONSE * dt);
      smoothTime += (targetTime - smoothTime) * alpha;
      if (targetTime === FREEZE_TIME && Math.abs(FREEZE_TIME - smoothTime) < 0.008) {
        smoothTime = FREEZE_TIME;
      }

      setReadyState(smoothTime >= FREEZE_TIME - SCROLL_SLOP);
      seekToTime(smoothTime, nowMs);
      drawFrame();
    }
    rafId = requestAnimationFrame(loop);
  }

  async function init() {
    if (skipIntroParam) {
      setReadyState(true);
      initialized = true;
      return;
    }

    resizeCanvas();

    try {
      await video.play();
      video.pause();
    } catch {
      // Autoplay unlock can fail; seek-driven rendering still works.
    }

    initialized = true;
    updateTargetFromScroll();
    smoothTime = targetTime || START_TIME;
    seekToTime(smoothTime, performance.now());

    if (rafId) cancelAnimationFrame(rafId);
    lastTick = 0;
    rafId = requestAnimationFrame(loop);
    setupVideoFrameCallback();
  }

  video.addEventListener("loadeddata", init, { once: true });

  video.addEventListener("seeked", drawFrame);
  video.addEventListener("timeupdate", drawFrame);
  video.addEventListener("timeupdate", () => {
    seekBusy = false;
  });
  video.addEventListener("seeked", () => {
    seekBusy = false;
    if (queuedTime !== null) {
      const next = queuedTime;
      queuedTime = null;
      seekToTime(next, performance.now());
    }
  });

  video.addEventListener("error", () => {
    const code = video.error ? video.error.code : "unknown";
    if (video.src.includes("Gatinho_Pendurado_na_Borda_Preta_RS.mp4")) {
      video.src = VIDEO_FALLBACK_SRC;
      video.load();
      return;
    }
    console.error("Falha ao carregar video:", video.src, "erro:", code);
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    updateTargetFromScroll();
  });

  video.load();

  function setupVideoFrameCallback() {
    if (typeof video.requestVideoFrameCallback !== "function" || hasRVFC) return;
    hasRVFC = true;

    const onFrame = () => {
      drawFrame();
      video.requestVideoFrameCallback(onFrame);
    };

    video.requestVideoFrameCallback(onFrame);
  }
})();

(() => {
  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach((item) => io.observe(item));
  }

  const gate = document.querySelector(".gate");
  const gateInner = document.querySelector(".gate-inner");
  if (gate && gateInner) {
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;

    gate.addEventListener("pointermove", (e) => {
      const r = gate.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 14;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 10;
    });

    gate.addEventListener("pointerleave", () => {
      tx = 0;
      ty = 0;
    });

    function animateGate() {
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      gateInner.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      requestAnimationFrame(animateGate);
    }

    requestAnimationFrame(animateGate);
  }

  const SCROLL_FIX_OFFSET = 120;
  const SCROLL_FIX_OFFSET_SERVICOS = 136;
  const fixedAnchors = new Set(["#o-que-fazemos", "#posso-ajudar"]);
  const scrollToFixedAnchor = (hash, behavior = "smooth") => {
    if (!fixedAnchors.has(hash)) return false;
    const target = document.querySelector(hash);
    if (!target) return false;
    const header = document.querySelector(".topbar");
    const headerH = header ? header.offsetHeight : 0;
    const offset = hash === "#o-que-fazemos" ? SCROLL_FIX_OFFSET_SERVICOS : SCROLL_FIX_OFFSET;
    const targetTop = window.scrollY + target.getBoundingClientRect().top - headerH - offset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior });
    return true;
  };

  const anchorLinks = document.querySelectorAll('a[href="#o-que-fazemos"], a[href="#posso-ajudar"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (ev) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      if (!scrollToFixedAnchor(href, "smooth")) return;
      ev.preventDefault();
      history.replaceState(null, "", href);
    });
  });

  const currentHash = window.location.hash;
  if (fixedAnchors.has(currentHash)) {
    requestAnimationFrame(() => {
      scrollToFixedAnchor(currentHash, "auto");
    });
  }

})();
