// DOM references
const actionLog = document.getElementById("action-log");
const dialogueText = document.getElementById("dialogue-text");
const environmentBaseImg = document.getElementById("environment-base");
const karaokeSongDetails = document.getElementById("karaoke-song-details");
const actionsRow = document.getElementById("actions-row");
const iconRow = document.getElementById("icon-row");
const locationNameEl = document.getElementById("location-name");
const songTitleEl = document.querySelector(".song-title");
const songArtistEl = document.querySelector(".song-artist");

// Image URLs
const BAR_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/unionbarpixel.png";
const KARAOKE_ROOM_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/KaraokeRoomPixel.png";
const FULL_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_full.gif";
const EMPTY_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_empty.gif";

// Karaoke songs come from songs.js
const SONG_LIST = (window.KARAOKE_SONGS || []).slice();
const SONGS_BY_ID = {};
SONG_LIST.forEach((song) => {
  SONGS_BY_ID[song.id] = song;
});

// State
let currentRoom = "bar"; // "bar" | "karaoke"
let currentSongId = SONG_LIST.length ? SONG_LIST[0].id : null;
let drinkCount = 0;

// -------------------------
// Utilities
// -------------------------

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

// Scale font sizes based on title length so everything fits in the box
function adjustSongFontSizes(titleText) {
  const len = titleText.length;
  let titleSizeRem;
  if (len <= 22) {
    titleSizeRem = 0.75; // short title
  } else if (len <= 35) {
    titleSizeRem = 0.7; // medium
  } else {
    titleSizeRem = 0.6; // long title
  }
  const artistSizeRem = Math.max(titleSizeRem - 0.15, 0.45);

  songTitleEl.style.fontSize = `${titleSizeRem}rem`;
  songArtistEl.style.fontSize = `${artistSizeRem}rem`;
}

// Set the current song text into the overlay
function setCurrentSong(songId) {
  const song = SONGS_BY_ID[songId];
  if (!song) return;

  currentSongId = songId;

  const titleText = song.title.toUpperCase();
  const artistText = song.artist.toUpperCase();

  songTitleEl.textContent = titleText;
  songArtistEl.textContent = artistText;
  adjustSongFontSizes(titleText);
}

// Show/hide overlay when needed
function setSongDetailsVisible(visible) {
  karaokeSongDetails.style.display = visible ? "flex" : "none";
}

function goToRoom(room) {
  currentRoom = room;
  if (room === "bar") {
    locationNameEl.textContent = "Pub – Bar";
    environmentBaseImg.src = BAR_IMAGE;
    appendToLog("You head back to the bar.");
    dialogueText.textContent =
      "The bar hums with low conversation and clinking glasses.";
    setSongDetailsVisible(false); // hide overlay outside karaoke
  } else if (room === "karaoke") {
    locationNameEl.textContent = "Karaoke Room";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;
    appendToLog("You step into the karaoke room.");
    dialogueText.textContent =
      "A small crowd hovers near the screen, waiting for their turn to murder a classic.";
    // overlay remains as-is until a song is picked
  }

  renderActions();
}

// Helpers to get song-specific dialogue, with generic fallback
function getSelectDialogue(song) {
  if (song.selectDialogue && song.selectDialogue.trim().length > 0) {
    return song.selectDialogue;
  }
  return (
    "The intro crackles through the speakers as the screen flashes " +
    song.artist.toUpperCase() +
    "."
  );
}

// -------------------------
// Actions & effects
// -------------------------

// Actions shared between rooms
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

// Actions available per room
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
  const songActions = SONG_LIST.filter(
    (song) => song.enabled !== false
  ).map((song) => ({
    key: `play:${song.id}`,
    label: `Sing "${song.title}" by ${song.artist}`
  }));

  return [
    ...songActions,
    { key: "wait", label: "Wait and see" },
    { key: "back-to-bar", label: "Go back to bar" }
  ];
}

// Render buttons
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

// Handle clicks
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

  // Karaoke: song selection (play:* keys)
  if (actionKey.startsWith("play:") && currentRoom === "karaoke") {
    const songId = actionKey.split(":")[1];
    const song = SONGS_BY_ID[songId];
    if (!song) return;

    // If customDialogue is provided, show that ONLY (no playback / overlay change)
    if (song.customDialogue && song.customDialogue.trim().length > 0) {
      appendToLog(
        `You select "${song.title}" by ${song.artist}, but the system hesitates.`
      );
      dialogueText.textContent = song.customDialogue;
      // Mp3 and overlay are intentionally not touched.
      return;
    }

    // Normal song behaviour (no audio yet, but overlay + dialogue)
    setCurrentSong(song.id);
    setSongDetailsVisible(true);

    appendToLog(`You queue up "${song.title}" by ${song.artist}.`);
    dialogueText.textContent = getSelectDialogue(song);
    // mp3Url will be used here later for actual audio playback.
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

// -------------------------
// Init
// -------------------------

window.addEventListener("DOMContentLoaded", () => {
  actionsRow.addEventListener("click", handleActionClick);

  // Initial song text/size from first song in the list (if any)
  if (currentSongId) {
    setCurrentSong(currentSongId);
  }

  goToRoom("bar");
  setSongDetailsVisible(false); // hidden by default
});
