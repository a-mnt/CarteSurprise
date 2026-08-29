const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const wrap = document.querySelector(".scratch-wrap");
const revealButton = document.getElementById("revealButton");

let drawing = false;
let lastPoint = null;
let revealed = false;

function resizeCanvas() {
  const rect = wrap.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  paintCover(rect.width, rect.height);
}

function paintCover(width, height) {
  ctx.globalCompositeOperation = "source-over";

  // Base argentée
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#c8c8c8");
  gradient.addColorStop(.25, "#8e8e8e");
  gradient.addColorStop(.5, "#d8d8d8");
  gradient.addColorStop(.75, "#909090");
  gradient.addColorStop(1, "#c6c6c6");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Texture façon ticket à gratter
  for (let i = 0; i < width * height / 28; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 1.3 + .3;
    ctx.fillStyle = Math.random() > .5
      ? "rgba(255,255,255,.16)"
      : "rgba(40,40,40,.10)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,.94)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.max(18, width * .035)}px "DM Sans", sans-serif`;
  ctx.fillText("GRATTE ICI", width / 2, height / 2 - 18);

  ctx.font = `500 ${Math.max(13, width * .022)}px "DM Sans", sans-serif`;
  ctx.fillText("pour découvrir ton cadeau 🎁", width / 2, height / 2 + 18);
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function scratch(point) {
  if (!lastPoint) lastPoint = point;

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(34, canvas.clientWidth * .065);

  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  // Petit rond au point de contact
  ctx.beginPath();
  ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();

  lastPoint = point;
  checkProgress();
}

function checkProgress() {
  if (revealed) return;

  // Analyse légère de la transparence d'une grille.
  const w = canvas.width;
  const h = canvas.height;
  const data = ctx.getImageData(0, 0, w, h).data;
  let transparent = 0;
  const step = 12 * 4;

  for (let i = 3; i < data.length; i += step) {
    if (data[i] < 20) transparent++;
  }

  const total = Math.ceil(data.length / step);
  if (transparent / total > 0.55) reveal();
}

function reveal() {
  if (revealed) return;
  revealed = true;

  canvas.style.transition = "opacity .7s ease";
  canvas.style.opacity = "0";
  revealButton.classList.add("done");
  revealButton.textContent = "🎉 Cadeau révélé !";

  setTimeout(() => {
    canvas.style.display = "none";
    burstConfetti();
  }, 700);
}

function burstConfetti() {
  for (let i = 0; i < 35; i++) {
    const piece = document.createElement("span");
    piece.textContent = ["🎉", "✨", "🎈", "💝", "⭐"][i % 5];
    piece.style.position = "fixed";
    piece.style.left = (45 + Math.random() * 10) + "vw";
    piece.style.top = "45vh";
    piece.style.fontSize = (14 + Math.random() * 16) + "px";
    piece.style.zIndex = "99";
    piece.style.pointerEvents = "none";
    document.body.appendChild(piece);

    const dx = (Math.random() - .5) * 500;
    const dy = -100 - Math.random() * 450;
    const rotate = (Math.random() - .5) * 900;

    piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`, opacity: 0 }
      ],
      { duration: 1100 + Math.random() * 900, easing: "cubic-bezier(.2,.8,.3,1)" }
    ).onfinish = () => piece.remove();
  }
}

canvas.addEventListener("pointerdown", (event) => {
  if (revealed) return;
  drawing = true;
  canvas.setPointerCapture(event.pointerId);
  lastPoint = getPoint(event);
  scratch(lastPoint);
});

canvas.addEventListener("pointermove", (event) => {
  if (!drawing || revealed) return;
  scratch(getPoint(event));
});

function stopDrawing() {
  drawing = false;
  lastPoint = null;
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("pointerleave", stopDrawing);

revealButton.addEventListener("click", reveal);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
