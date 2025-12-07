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
let currentAudio = null; // active audio playback (if any)

// -------------------------
// Utilities
// -------------------------

function appendToLog(text) {
  const li = document.createElement("li");
  li.textContent = text;

  // Most recent at the top
  if (actionLog.firstChild) {
    actionLog.insertBefore(li, actionLog.firstChild);
  } else {
    actionLog.appendChild(li);
  }

  actionLog.scrollTop = 0;
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

  setTimeout(() => {
    img.src = EMPTY_PINT_URL;
  }, 3000);
}

// Stop any currently playing audio
function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {
      // ignore
    }
    currentAudio = null;
  }
}

function adjustSongFontSizes(titleText) {
  const len = titleText.length;
  let titleSizeRem;
  if (len <= 22) {
    titleSizeRem = 0.75;
  } else if (len <= 35) {
    titleSizeRem = 0.7;
  } else {
    titleSizeRem = 0.6;
  }
  const artistSizeRem = Math.max(titleSizeRem - 0.15, 0.45);

  songTitleEl.style.fontSize = `${titleSizeRem}rem`;
  songArtistEl.style.fontSize = `${artistSizeRem}rem`;
}

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

function setSongDetailsVisible(visible) {
  karaokeSongDetails.style.display = visible ? "flex" : "none";
}

// room can be "bar" or "karaoke"
// options.initial = true means "first time setup", so no extra log entry
function goToRoom(room, options = {}) {
  const { initial = false } = options;
  currentRoom = room;

  if (room === "bar") {
    locationNameEl.textContent = "Pub – Bar";
    environmentBaseImg.src = BAR_IMAGE;

    if (!initial) {
      appendToLog("You head back to the bar.");
    }

    dialogueText.textContent =
      "The bar hums with low conversation and clinking glasses.";

    // Leaving karaoke: stop audio and clear the karaoke screen
    stopCurrentAudio();
    setSongDetailsVisible(false);
  } else if (room === "karaoke") {
    locationNameEl.textContent = "Karaoke Room";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;
    appendToLog("You step into the karaoke room.");
    dialogueText.textContent =
      "A small crowd hovers near the screen, waiting for their turn to murder a classic.";
    // Karaoke overlay will be managed per-song
  }

  renderActions();
}

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

const commonActionEffects = {
  "order-drink": {
    log: "You order a drink. The bartender eyes you carefully.",
    dialogue:
      '"What\'s your poison?" the bartender asks, polishing a glass that has seen better decades.'
  }
};

function getActionsForRoom() {
  if (currentRoom === "bar") {
    return [
      { key: "order-drink", label: "Order a drink" },
      { key: "go-karaoke", label: "Karaoke Room" }
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
    { key: "back-to-bar", label: "Go back to bar" }
  ];
}

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

function handleActionClick(event) {
  const button = event.target.closest(".action-button");
  if (!button) return;

  const actionKey = button.dataset.action;

  // Move between rooms
  if (actionKey === "go-karaoke") {
    goToRoom("karaoke");
    return;
  }
  if (actionKey === "back-to-bar") {
    goToRoom("bar");
    return;
  }

  // Karaoke: song selection
  if (actionKey.startsWith("play:") && currentRoom === "karaoke") {
    const songId = actionKey.split(":")[1];
    const song = SONGS_BY_ID[songId];
    if (!song) return;

    // Any new selection stops whatever is playing
    stopCurrentAudio();

    // If customDialogue is provided, only update dialogue + log
    if (song.customDialogue && song.customDialogue.trim().length > 0) {
      appendToLog(
        `You select "${song.title}" by ${song.artist}, but Rockin Ronnie hesitates.`
      );
      dialogueText.textContent = song.customDialogue;
      // Karaoke screen / audio remain as they were
      return;
    }

    // Normal song behaviour
    const hasAudio =
      song.mp3Url && typeof song.mp3Url === "string" && song.mp3Url.trim() !== "";

    // Update overlay with song title/artist
    setCurrentSong(song.id);
    setSongDetailsVisible(true);

    appendToLog(`You queue up "${song.title}" by ${song.artist}.`);
    dialogueText.textContent = getSelectDialogue(song);

    if (hasAudio) {
      // Play the audio once; overlay visible only while it plays
      const audio = new Audio(song.mp3Url);
      currentAudio = audio;

      audio.addEventListener("ended", () => {
        // Only clear if this is still the active audio instance
        if (currentAudio === audio) {
          setSongDetailsVisible(false);
          appendToLog("The track ends and the karaoke screen clears.");
          currentAudio = null;
        }
      });

      audio.addEventListener("error", () => {
        if (currentAudio === audio) {
          setSongDetailsVisible(false);
          appendToLog("The speakers crackle, but nothing plays.");
          currentAudio = null;
        }
      });

      audio
        .play()
        .catch(() => {
          if (currentAudio === audio) {
            setSongDetailsVisible(false);
            appendToLog("The speakers crackle, but nothing plays.");
            currentAudio = null;
          }
        });
    } else {
      // No audio available: keep overlay visible (legacy behaviour)
      // You can change this if you prefer a timeout-based clear.
    }

    return;
  }

  // Bar-only actions (currently just "order-drink")
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

  if (currentSongId) {
    setCurrentSong(currentSongId);
  }

  // Initial entry already in HTML: "You step into the bar."
  // We set up the bar state without adding another log entry.
  goToRoom("bar", { initial: true });
  setSongDetailsVisible(false);
});
