const SITE_PASSWORD = "0803";

const LETTER_TEXT = `
Gửi em,

Chúc em một ngày 8/3 thật vui, thật rạng rỡ và luôn ngập tràn những điều dễ thương.
Cảm ơn em vì đã xuất hiện, vì đã mang đến rất nhiều cảm xúc đẹp trong những ngày bình thường nhất.

Mong em luôn cười nhiều,
luôn xinh đẹp theo cách riêng của em,
và luôn gặp những điều dịu dàng nhất.

Happy Women's Day 💖
`;

const GIFT_MESSAGES = [
  "🎁 Quà bí mật: Một buổi đi chơi thật vui cùng anh.",
  "💐 Quà bí mật: Một buổi tối coi phim em thích.",
  "💖 Quà bí mật: Một điều ước hôm nay của em sẽ được ưu tiên.",
  "✨ Quà bí mật: Một ngày thật hạnh phúc dành riêng cho em."
];

/* File đang nằm ở thư mục gốc repo */
const PLAYLIST = [
  {
    title: "Dành cho em",
    file: "bai1.mp3"
  },
  {
    title: "Người nào đó",
    file: "bai2.mp3"
  },
  {
    title: "Dù thế nào đi nữa",
    file: "bai3.mp3"
  }
];

const GALLERY_IMAGES = [
  { src: "anh1.jpg", alt: "Ảnh kỷ niệm 1" },
  { src: "anh2.jpg", alt: "Ảnh kỷ niệm 2" },
  { src: "anh3.jpg", alt: "Ảnh kỷ niệm 3" },
  { src: "anh4.jpg", alt: "Ảnh kỷ niệm 4" }
];

const HEART_SYMBOLS = ["💖", "💗", "💕", "💞", "💓"];

const lockScreen = document.getElementById("lockScreen");
const mainContent = document.getElementById("mainContent");
const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const errorMessage = document.getElementById("errorMessage");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOverlay = document.getElementById("modalOverlay");
const menuCards = document.querySelectorAll(".menu-card");
const floatingHearts = document.getElementById("floatingHearts");

let currentAudio = null;
let currentTrackIndex = 0;
let backgroundAudio = null;

/* Floating hearts */
function createHeart() {
  if (!floatingHearts) return;

  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${16 + Math.random() * 20}px`;
  heart.style.animationDuration = `${6 + Math.random() * 5}s`;
  heart.style.opacity = `${0.12 + Math.random() * 0.25}`;

  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 11000);
}

setInterval(createHeart, 500);

/* Background music after unlock */
function startBackgroundMusic() {
  if (backgroundAudio) return;

  backgroundAudio = new Audio(PLAYLIST[0].file);
  backgroundAudio.loop = true;
  backgroundAudio.volume = 0.55;

  backgroundAudio.play().catch(() => {
    // Một số trình duyệt vẫn có thể chặn; user có thể mở mục Music để phát tay
  });
}

/* Unlock site */
function unlockSite() {
  const inputValue = passwordInput.value.trim();

  if (inputValue === SITE_PASSWORD) {
    errorMessage.textContent = "";
    lockScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    startBackgroundMusic();
  } else {
    errorMessage.textContent = "Sai mật khẩu rồi nè, thử lại nha 💭";
    passwordInput.focus();
  }
}

unlockBtn.addEventListener("click", unlockSite);

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    unlockSite();
  }
});

/* Modal control */
function openModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/* Menu click */
menuCards.forEach((card) => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;

    if (type === "music") renderMusicModal();
    if (type === "letter") renderLetterModal();
    if (type === "image") renderImageModal();
    if (type === "gift") renderGiftModal();

    openModal();
  });
});

/* Music modal */
function renderMusicModal() {
  modalContent.innerHTML = `
    <h2 class="modal-title">🎵 Playlist dành cho em</h2>

    <div class="music-player">
      <div class="soft-card">
        <audio id="audioPlayer" controls style="width: 100%;">
          <source src="${PLAYLIST[currentTrackIndex].file}" type="audio/mpeg">
          Trình duyệt của bạn không hỗ trợ audio.
        </audio>
      </div>

      <div class="soft-card">
        <strong>Danh sách nhạc:</strong>
        <div class="track-list" id="trackList"></div>
      </div>
    </div>
  `;

  currentAudio = document.getElementById("audioPlayer");
  const trackList = document.getElementById("trackList");

  PLAYLIST.forEach((track, index) => {
    const btn = document.createElement("button");
    btn.className = "track-item" + (index === currentTrackIndex ? " active" : "");
    btn.textContent = `${index + 1}. ${track.title}`;

    btn.addEventListener("click", () => {
      currentTrackIndex = index;
      renderMusicModal();
    });

    trackList.appendChild(btn);
  });

  currentAudio.play().catch(() => {});

  currentAudio.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    renderMusicModal();
  });
}

/* Letter modal */
function renderLetterModal() {
  modalContent.innerHTML = `
    <h2 class="modal-title">💌 Một lá thư nhỏ</h2>
    <div class="soft-card">
      <div class="modal-text">${LETTER_TEXT}</div>
    </div>
  `;
}

/* Image modal */
function renderImageModal() {
  const imagesHtml = GALLERY_IMAGES.map(
    (img) => `
      <div class="gallery-item">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" />
      </div>
    `
  ).join("");

  modalContent.innerHTML = `
    <h2 class="modal-title">🖼️ Album kỷ niệm</h2>
    <div class="gallery-grid">
      ${imagesHtml}
    </div>
  `;
}

/* Confetti */
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const particles = [];
  const count = 180;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();

  const colors = ["#ff6fa5", "#ffd166", "#7bdff2", "#b2f7ef", "#f7aef8", "#ffffff"];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.4,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 4,
      gravity: 0.06 + Math.random() * 0.08,
      rotate: Math.random() * Math.PI,
      rotateSpeed: -0.15 + Math.random() * 0.3
    });
  }

  let animationId;
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotate += p.rotateSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotate);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    animationId = requestAnimationFrame(draw);

    if (frame > 220) {
      cancelAnimationFrame(animationId);
      canvas.remove();
    }
  }

  draw();

  window.addEventListener("resize", resizeCanvas, { once: true });
}

/* Gift modal */
function renderGiftModal() {
  modalContent.innerHTML = `
    <h2 class="modal-title">🎁 Món quà bí mật</h2>

    <div class="gift-wrap">
      <div class="gift-box">🎁</div>
      <div class="soft-card">
        Bấm nút bên dưới để mở quà nha ✨
      </div>

      <button class="gift-button" id="openGiftBtn">Mở quà</button>
      <div class="gift-result" id="giftResult"></div>
    </div>
  `;

  const openGiftBtn = document.getElementById("openGiftBtn");
  const giftResult = document.getElementById("giftResult");

  openGiftBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * GIFT_MESSAGES.length);
    giftResult.textContent = GIFT_MESSAGES[randomIndex];
    launchConfetti();
  });
}