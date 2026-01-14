/* ===============================
   CLOCK (CDMX)
================================ */
function updateClock() {
  const now = new Date().toLocaleTimeString("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit"
  });
  document.getElementById("clock").textContent = now;
}
setInterval(updateClock, 1000);
updateClock();

/* ===============================
   WINDOW DRAG + SAVE STATE
================================ */
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

const windows = document.querySelectorAll(".window");

function saveState() {
  const state = {};
  windows.forEach(win => {
    state[win.dataset.id] = {
      top: win.style.top,
      left: win.style.left
    };
  });
  localStorage.setItem("glasspad-state", JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("glasspad-state"));
  if (!state) return;

  windows.forEach(win => {
    const data = state[win.dataset.id];
    if (data) {
      win.style.top = data.top;
      win.style.left = data.left;
    }
  });
}

windows.forEach(win => {
  const bar = win.querySelector(".titlebar");

  bar.addEventListener("mousedown", e => {
    activeWindow = win;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = Date.now();
  });
});

document.addEventListener("mousemove", e => {
  if (!activeWindow) return;
  activeWindow.style.left = (e.clientX - offsetX) + "px";
  activeWindow.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
  if (activeWindow) saveState();
  activeWindow = null;
});

/* ===============================
   INIT
================================ */
loadState();
