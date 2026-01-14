/* CLOCK */
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

/* WINDOWS */
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

const windows = document.querySelectorAll(".window");

/* SAVE STATE */
function saveState() {
  const state = {};
  windows.forEach(win => {
    const contentId = win.querySelector(".content")?.id;
    state[win.dataset.id] = {
      top: win.style.top,
      left: win.style.left,
      hidden: win.classList.contains("hidden"),
      content: contentId ? document.getElementById(contentId).innerHTML : undefined
    };
  });
  localStorage.setItem("glasspad-state", JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("glasspad-state"));
  if (!state) return;

  windows.forEach(win => {
    const data = state[win.dataset.id];
    if (!data) return;
    win.style.top = data.top;
    win.style.left = data.left;
    if (data.hidden) win.classList.add("hidden");
    if (data.content) {
      const contentId = win.querySelector(".content")?.id;
      if (contentId) document.getElementById(contentId).innerHTML = data.content;
    }
  });
}

/* DRAG */
windows.forEach(win => {
  const bar = win.querySelector(".titlebar");

  bar.addEventListener("mousedown", e => {
    if (e.target.classList.contains("control")) return;
    activeWindow = win;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = Date.now();
  });
});

/* CONTROLS */
document.querySelectorAll(".control.close").forEach(btn => {
  btn.addEventListener("click", e => {
    const win = e.target.closest(".window");
    win.classList.add("hidden");
    saveState();
  });
});

document.querySelectorAll(".control.minimize").forEach(btn => {
  btn.addEventListener("click", e => {
    const win = e.target.closest(".window");
    win.classList.toggle("hidden");
    saveState();
  });
});

/* DOCK */
document.querySelectorAll(".dock-item").forEach(item => {
  item.addEventListener("click", () => {
    const id = item.dataset.open;
    const win = document.querySelector(`.window[data-id="${id}"]`);
    if (!win) return;
    win.classList.remove("hidden");
    win.style.zIndex = Date.now();
    saveState();
  });
});

/* NOTES AUTOSAVE */
const notes = document.getElementById("notes-content");
notes.addEventListener("input", () => {
  saveState();
});

/* MOUSE MOVE */
document.addEventListener("mousemove", e => {
  if (!activeWindow) return;
  activeWindow.style.left = (e.clientX - offsetX) + "px";
  activeWindow.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
  if (activeWindow) saveState();
  activeWindow = null;
});

/* INIT */
loadState();
