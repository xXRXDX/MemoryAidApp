// frontend/src/utils/focus.js

let isFocused = true;
let isIdle = false;
let idleTimeout = null;
let idleTimeLimit = 30000; // 30 sec

const listeners = [];

export function onFocusStatusChange(callback) {
  listeners.push(callback);
}

function notify(status) {
  listeners.forEach(cb => cb(status));
}

function setIdle(state) {
  if (isIdle !== state) {
    isIdle = state;
    notify(getStatus());
  }
}

function setFocus(state) {
  if (isFocused !== state) {
    isFocused = state;
    notify(getStatus());
  }
}

export function getStatus() {
  if (!isFocused) return "not-focused";
  if (isIdle) return "idle";
  return "focused";
}

export function startFocusTracking() {
  // TAB VISIBILITY CHANGE
  document.addEventListener("visibilitychange", () => {
    setFocus(!document.hidden);
  });

  // USER ACTIVITY DETECTION
  const resetIdleTimer = () => {
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => setIdle(true), idleTimeLimit);

    setIdle(false);
  };

  ["mousemove", "keydown", "mousedown", "scroll", "touchstart"].forEach(event => {
    window.addEventListener(event, resetIdleTimer);
  });

  resetIdleTimer();
}
