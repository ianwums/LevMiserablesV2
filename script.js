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

// Karaoke songs
const SONGS = {
  morrissey: {
    id: "morrissey",
    titleDisplay: "Everyday Is Like Sunday",
    artistDisplay: "Morrissey",
    titleText: "EVERYDAY IS LIKE SUNDAY",
    artistText: "MORRISSEY"
  },
  kitchen: {
    id: "kitchen",
    titleDisplay: "You'll Always Find Me In The Kitchen At Parties",
    artistDisplay: "Jona Lewie",
    titleText: "YOU'LL ALWAYS FIND ME IN THE KITCHEN AT PARTIES",
    artistText: "JONA LEWIE"
  }
};

// State
let currentRoom = "bar"; // "bar" | "karaoke"
let songDetailsVisible = false;
let currentSongId = "morrissey";
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
      key: "play-morrissey",
      label: 'Play "Everyday Is Like Sunday"'
    },
    {
      key: "play-kitchen",
      label: 'Play "Kitchen At Parties"'
    },
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

// Scale font sizes based on title length so everything fits in the box
function adjustSongFontSizes(titleText) {
  const len = titleText.length;
  let titleSizeRem;
  if (len <= 22) {
    titleSizeRem = 0.75; // short title
  } else if (len <= 35) {
    titleSizeRem = 0.7; // medium
  } else {
    titleSizeRem = 0.6; // long title (e.g. Kitchen At Parties)
  }
  const artistSizeRem = Math.max(titleSizeRem - 0.15, 0.45);

  songTitleEl.style.fontSize = `${titleSizeRem}rem`;
  songArtistEl.style.fontSize = `${artistSizeRem}rem`;
}

// Set the current song text into the overlay
function setCurrentSong(songId) {
  const song = SONGS[songId];
  currentSongId = songId;

  songTitleEl.textContent = song.titleText;
  songArtistEl.textContent = song.artistText;
  adjustSongFontSizes(song.titleText);
}

// Show/hide overlay
function setSongDetailsVisible(visible) {
  songDetailsVisible = visible;
  karaokeSongDetails.style.display = visible ? "flex" : "none";
  renderActions(); // update button labels
}

function goToRoom(room) {
  currentRoom = room;
  if (room === "bar") {
    locationNameEl.textContent = "Pub – Bar";
    environmentBaseImg.src = BAR_IMAGE;
    appendToLog("You head back to the bar.");
    dialogueText.textContent =
      "The bar hums with low conversation and clinking glasses.";
    setSongDetailsVisible(false); // hide if coming back from karaoke
  } else if (room === "karaoke") {
    locationNameEl.textContent = "Karaoke Room";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;
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

  // Karaoke: choose songs
  if (actionKey === "play-morrissey" && currentRoom === "karaoke") {
    const song = SONGS.morrissey;
    setCurrentSong(song.id);
    setSongDetailsVisible(true);
    appendToLog(
      `You queue up "${song.titleDisplay}" by ${song.artistDisplay}.`
    );
    dialogueText.textContent =
      "The intro crackles through the speakers as the screen flashes MORRISSEY.";
    return;
  }

  if (actionKey === "play-kitchen" && currentRoom === "karaoke") {
    const song = SONGS.kitchen;
    setCurrentSong(song.id);
    setSongDetailsVisible(true);
    appendToLog(
      `You queue up "${song.titleDisplay}" by ${song.artistDisplay}.`
    );
    dialogueText.textContent =
      "The crowd murmurs appreciatively as the familiar synth line kicks in.";
    return;
  }

  // Karaoke-specific toggle
  if (actionKey === "toggle-song-details" && currentRoom === "karaoke") {
    const nowVisible = !songDetailsVisible;
    setSongDetailsVisible(nowVisible);

    const currentSong = SONGS[currentSongId];
    appendToLog(
      nowVisible
        ? `Song details appear on the karaoke screen (${currentSong.titleDisplay}).`
        : "The karaoke screen clears, waiting for the next song."
    );
    dialogueText.textContent = nowVisible
      ? `The screen announces: ${currentSong.titleDisplay.toUpperCase()} – ${currentSong.artistDisplay.toUpperCase()}.`
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
  setCurrentSong("morrissey");  // default song text/size
  goToRoom("bar");
  setSongDetailsVisible(false); // hidden by default
});
