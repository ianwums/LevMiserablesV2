// DOM references
const actionLog = document.getElementById("action-log");
const dialogueText = document.getElementById("dialogue-text");
const environmentBaseImg = document.getElementById("environment-base");
const karaokeOverlay = document.getElementById("karaoke-overlay");
const karaokeSongDetails = document.getElementById("karaoke-song-details");
const actionsRow = document.getElementById("actions-row");
const iconRow = document.getElementById("icon-row");
const locationNameEl = document.getElementById("location-name");

// Image URLs
const BAR_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/unionbarpixel.png";
const KARAOKE_ROOM_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/KaraokeRoomPixel.png";
const FULL_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_full.gif";
const EMPTY_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_empty.gif";

// State
let currentRoom = "bar"; // "bar" | "karaoke"
let songDetailsVisible = false;
let drinkCount = 0;

// --- Actions available per room --- //
function getActionsForRoom() {
  if (currentRoom === "bar") {
    return [
      { key: "order-drink", label: "Order a drink" },
      { key: "talk-bartender", label: "Talk to the bartender" },
      { key: "inspect-room", label: "Inspect the room" },
      { key: "wait", label: "Wait and see" },
      { key: "go-karaoke", label: "Karaoke" }
    ];
  }

  // Karaoke room
  return [
    {
      key: "toggle-song-details",
      label: songDetailsVisible ? "Hide song details" : "Show song details"
    },
    { key: "wait", label: "Wait and see" },
    { key: "back-to-bar", label: "Go back to bar" }
  ];
}

// --- Action effects shared between rooms --- //
const commonActionEffects = {
  "order-drink": {
    log: "You order a drink. The bartender eyes you carefully.",
    dialogue:
      '"What\'s your poison?" the bartender asks, polishing a glass that has seen better decades.'
  },
  "talk-bartender": {
    log: "You strike up a conversation with the bartender.",
    dialogue:
      '"You don\'t look like the usual crowd," they say. "Looking for trouble or trying to avoid it?"'
  },
  "inspect-room": {
    log: "You look around the room, taking in the details.",
    dialogue:
      "The bar is cluttered with mismatched stools, old posters and a mirror that has heard too many secrets."
  },
  wait: {
    log: "You wait. The pub creaks and murmurs around you.",
    dialogue:
      "Time passes, and with it the noise of the front bar swells and ebbs like a tired tide."
  }
};

// --- Utilities --- //
function appendToLog(text) {
  const li = document.createElement("li");
  li.textContent = text;
  actionLog.appendChild(li);
  actionLog.scrollTop = actionLog.scrollHeight;
}

function addDrinkIcon() {
  drinkCount += 1;

  const slot = document.createElement("div");
  slot.className = "drink-slot";

  const img = document.createElement("img");
  img.className = "drink-image";
  img.src = FULL_PINT_URL;
  img.alt = `Pint of stout #${drinkCount}`;

  slot.appendChild(img);
  iconRow.appendChild(slot);

  // After 3 seconds, the pint becomes empty
  setTimeout(() => {
    img.src = EMPTY_PINT_URL;
  }, 3000);
}

function setSongDetailsVisible(visible) {
  songDetailsVisible = visible;
  karaokeSongDetails.style.display = visible ? "flex" : "none";
  renderActions(); // update button label
}

function goToRoom(room) {
  currentRoom = room;
  if (room === "bar") {
    locationNameEl.textContent = "Pub – Bar";
    environmentBaseImg.src = BAR_IMAGE;
    karaokeOverlay.style.display = "none";
    appendToLog("You head back to the bar.");
    dialogueText.textContent =
      "The bar hums with low conversation and clinking glasses.";
  } else if (room === "karaoke") {
    locationNameEl.textContent = "Karaoke Room";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;
    karaokeOverlay.style.display = "block";
    appendToLog("You step into the karaoke room.");
    dialogueText.textContent =
      "A small crowd hovers near the screen, waiting for their turn to murder a classic.";
  }

  renderActions();
}

// --- Rendering --- //
function renderActions() {
  const actions = getActionsForRoom();
  actionsRow.innerHTML = "";

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "action-button";
    button.dataset.action = action.key;
    button.textContent = action.label;
    actionsRow.appendChild(button);
  });
}

// --- Action handling --- //
function handleActionClick(event) {
  const button = event.target.closest(".action-button");
  if (!button) return;

  const actionKey = button.dataset.action;

  // Room-transition actions
  if (actionKey === "go-karaoke") {
    goToRoom("karaoke");
    return;
  }
  if (actionKey === "back-to-bar") {
    goToRoom("bar");
    return;
  }

  // Karaoke-specific action
  if (actionKey === "toggle-song-details" && currentRoom === "karaoke") {
    const nowVisible = !songDetailsVisible;
    setSongDetailsVisible(nowVisible);

    appendToLog(
      nowVisible
        ? "Song details appear on the karaoke screen."
        : "The karaoke screen clears, waiting for the next song."
    );
    dialogueText.textContent = nowVisible
      ? "The screen announces: EVERYDAY IS LIKE SUNDAY – MORRISSEY."
      : "The crowd grumbles as the text fades, eager for the next track.";
    return;
  }

  // Common actions
  const effect = commonActionEffects[actionKey];
  if (effect) {
    appendToLog(effect.log);
    dialogueText.textContent = effect.dialogue;

    if (actionKey === "order-drink" && currentRoom === "bar") {
      addDrinkIcon();
    }
  }
}

// --- Init --- //
window.addEventListener("DOMContentLoaded", () => {
  actionsRow.addEventListener("click", handleActionClick);

  // Initial setup
  goToRoom("bar");
  setSongDetailsVisible(false); // hidden by default
});
