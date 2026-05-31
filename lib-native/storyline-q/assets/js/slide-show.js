let slideData = null;
let currentSlide = 0;
let audio = null;
let typingInterval = null;

/* ========== INIT ========== */
async function initSlideShow() {
  try {
    const res = await fetch("./slideShow.json");
    slideData = await res.json();

    await initSlide(0);

    // ربط الكنترولز
    document.getElementById("prevBtn").addEventListener("click", prevSlide);
    document.getElementById("nextBtn").addEventListener("click", nextSlide);
    document
      .getElementById("playPauseBtn")
      .addEventListener("click", togglePlayPause);
  } catch (e) {
    console.error("SlideShow Init Error:", e);
  }
}

/* ========== PRELOADERS ========== */
function preloadAudio(src) {
  return new Promise((resolve, reject) => {
    const a = new Audio();
    a.src = src;
    a.preload = "auto";
    a.addEventListener("canplaythrough", () => resolve(a), { once: true });
    a.addEventListener("error", reject, { once: true });
  });
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

async function preloadSlide(slide) {
  const [img, audioEl] = await Promise.all([
    preloadImage(slide.image),
    preloadAudio(slide.audio),
  ]);
  return { img, audio: audioEl };
}

/* ========== INIT SLIDE ========== */
async function initSlide(index) {
  // مسح النص القديم وإيقاف الصوت
  if (typingInterval) clearInterval(typingInterval);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.onended = null;
  }

  const slide = slideData.slides[index];
  const assets = await preloadSlide(slide);

  const textP = document.querySelector(".slidShow .paragraph-postion p");
  const imgEl = document.querySelector(".slidShow .image-postion img");

  imgEl.src = assets.img.src;
  textP.innerHTML = "";

  audio = assets.audio;
  startSlide(slide);

  // ======= تحديث حالة الأزرار =======
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = index === 0; // لو في الاول يبقى Prev معطل
  nextBtn.disabled = index === slideData.slides.length - 1; // لو في الاخر يبقى Next معطل
}

/* ========== START SLIDE ========== */
function startSlide(slide) {
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().then(() => {
    syncText(slide);
    updatePlayPauseButton(); // update when starts
  });

  audio.onended = () => {
    updatePlayPauseButton(); // update when ends
    nextSlide();
  };
}

/* ========== SYNC TEXT ========== */
function syncText(slide) {
  const textP = document.querySelector(".slidShow .paragraph-postion p");
  const chars = slide.fullText.split("");
  const totalChars = chars.length;

  // duration من JSON
  const duration = slide.duration || audio.duration;
  const speedFactor = 0.9;
  const timePerChar = (duration / totalChars) * speedFactor * 1000;

  let index = 0;

  if (typingInterval) clearInterval(typingInterval);

  typingInterval = setInterval(() => {
    if (!audio || audio.paused) return;

    if (index < totalChars) {
      textP.innerHTML += chars[index];
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, timePerChar);
}

function stopSlideShow() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.ontimeupdate = null;
    audio.onended = null;
    audio = null;
  }
}

/* ========== NAVIGATION ========== */
function nextSlide() {
  if (currentSlide < slideData.slides.length - 1) {
    currentSlide++;
    initSlide(currentSlide);
  } else {
    // آخر سلايد: نوقف الصوت والنص
    if (audio) audio.pause();
    if (typingInterval) clearInterval(typingInterval);
    currentSlide = 0;
    if (window.app && typeof window.app.goToNextNav === "function") {
      window.app.goToNextNav();
    }
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    initSlide(currentSlide);
  } else {
    if (audio) audio.pause();
    if (typingInterval) clearInterval(typingInterval);
    if (window.app && typeof window.app.goToNextNav === "function") {
      window.app.goToPrevNav();
    }
  }
}

/* ========== CONTROLS ========== */
function togglePlayPause() {
  if (!audio) return;
  if (audio.paused) audio.play();
  else audio.pause();

  updatePlayPauseButton();
}
function updatePlayPauseButton() {
  const btn = document.getElementById("playPauseBtn");
  if (!audio) return;

  btn.classList.remove("play", "pause");

  if (audio.paused) {
    btn.classList.add("play");
  } else {
    btn.classList.add("pause");
  }
}
