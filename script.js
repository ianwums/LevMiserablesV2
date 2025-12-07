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
const environmentFrame = document.getElementById("environment-frame");
const hoverLabel = document.getElementById("environment-hover-label");

// Song list overlay DOM
const songListOverlay = document.getElementById("song-list-overlay");
const songListContainer = document.getElementById("song-list-container");
const songListCloseBtn = document.getElementById("song-list-close");

// Image URLs
const BAR_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/unionbarpixel.png";
const KARAOKE_ROOM_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/KaraokeRoomPixel.png";
const FULL_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_full.gif";
const EMPTY_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_empty.gif";
const POINTER_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/UI_Elements/pointer.gif";

// Karaoke songs come from songs.js
const SONG_LIST = (window.KARAOKE_SONGS || []).slice();
const SONGS_BY_ID = {};
SONG_LIST.forEach((song) => {
  SONGS_BY_ID[song.id] = song;
});

// Action log messages for end-of-song
const KARAOKE_END_LOG_MESSAGES = [
  "The crowd go wild",
  "The room is notably emptier than before you sang",
  "You might not sing again after that performance",
  "Mary seems to have stuffed tissue in her ears",
  "That's My Dad!"
];

// Track last message index so we don't repeat immediately
let lastKaraokeEndIndex = null;

// Hotspot configuration (percentages relative to 800x600 image)
const HOTSPOTS = {
  bar: [
    {
      id: "bar-order-drink",
      // bottom-left-ish
      xPercent: 6, // from left
      yPercent: 75, // from top
      widthPercent: (50 / 800) * 100, // ≈6.25%
      heightPercent: (50 / 600) * 100, // ≈8.33%
      hoverText: "Order drink",
      actionKey: "order-drink"
    },
    {
      id: "bar-karaoke-room",
      // bottom-right-ish
      xPercent: 85, // from left
      yPercent: 78, // from top
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Karaoke Room",
      actionKey: "go-karaoke"
    }
  ],
  karaoke: []
};

// State
let currentRoom = "bar"; // "bar" | "karaoke"
let currentSongId = SONG_LIST.length ? SONG_LIST[0].id : null;
let drinkCount = 0;
let currentAudio = null; // active audio playback (if any)
let customCursorEl = null; // our fake cursor image

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

// Pick a random karaoke end-of-song log line (no immediate repeats)
function getRandomKaraokeEndLogMessage() {
  const len = KARAOKE_END_LOG_MESSAGES.length;
  if (!len) return "";
  if (len === 1) return KARAOKE_END_LOG_MESSAGES[0];

  let index;
  do {
    index = Math.floor(Math.random() * len);
  } while (index === lastKaraokeEndIndex);

  lastKaraokeEndIndex = index;
  return KARAOKE_END_LOG_MESSAGES[index];
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

// -------------------------
// Hotspots
// -------------------------

function renderHotspotsForRoom(roomId) {
  if (!environmentFrame) return;

  // Remove any existing hotspots
  environmentFrame.querySelectorAll(".hotspot").forEach((el) => el.remove());

  const hotspots = HOTSPOTS[roomId] || [];
  hotspots.forEach((h) => {
    const el = document.createElement("button");
    el.className = "hotspot";
    el.dataset.actionKey = h.actionKey;
    if (h.hoverText) {
      el.dataset.hoverText = h.hoverText;
    }

    el.style.left = `${h.xPercent}%`;
    el.style.top = `${h.yPercent}%`;
    el.style.width = `${h.widthPercent}%`;
    el.style.height = `${h.heightPercent}%`;

    environmentFrame.appendChild(el);
  });
}

// -------------------------
// Room transitions
// -------------------------

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
    hideSongListOverlay();
  } else if (room === "karaoke") {
    locationNameEl.textContent = "Karaoke Room";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;
    appendToLog("You step into the karaoke room.");
    dialogueText.textContent =
      "A small crowd hovers near the screen, waiting for their turn to murder a classic.";
    // Karaoke overlay will be managed per-song
  }

  renderActions();
  renderHotspotsForRoom(room);
}

// helper for karaoke dialogue
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
// Song list overlay helpers
// -------------------------

function renderSongList() {
  if (!songListContainer) return;

  songListContainer.innerHTML = "";

  const enabledSongs = SONG_LIST.filter((song) => song.enabled !== false);

  // Sort by artist name A–Z
  enabledSongs.sort((a, b) => a.artist.localeCompare(b.artist));

  enabledSongs.forEach((song) => {
    const btn = document.createElement("button");
    btn.className = "song-list-item";
    btn.dataset.songId = song.id;

    const artistSpan = document.createElement("span");
    artistSpan.className = "song-list-artist";
    artistSpan.textContent = song.artist;

    const titleSpan = document.createElement("span");
    titleSpan.className = "song-list-title";
    titleSpan.textContent = song.title;

    btn.appendChild(artistSpan);
    btn.appendChild(titleSpan);

    songListContainer.appendChild(btn);
  });
}

function showSongListOverlay() {
  if (!songListOverlay) return;
  renderSongList();
  songListOverlay.classList.add("is-visible");
}

function hideSongListOverlay() {
  if (!songListOverlay) return;
  songListOverlay.classList.remove("is-visible");
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

  // Karaoke room: just Song list + back
  return [
    { key: "open-song-list", label: "Song list" },
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

// -------------------------
// Karaoke song playback
// -------------------------

// Main song-playing logic, used by song list overlay
function playSongById(songId) {
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
        const endMsg = getRandomKaraokeEndLogMessage();
        if (endMsg) {
          appendToLog(endMsg);
        }
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
    // No audio available: keep overlay visible (or you could add a timeout here)
  }
}

// -------------------------
// Action dispatcher
// -------------------------

// General action dispatcher used by buttons + hotspots
function performAction(actionKey) {
  // Room navigation
  if (actionKey === "go-karaoke") {
    goToRoom("karaoke");
    return;
  }
  if (actionKey === "back-to-bar") {
    goToRoom("bar");
    return;
  }

  // Open song list
  if (actionKey === "open-song-list" && currentRoom === "karaoke") {
    showSongListOverlay();
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

function handleActionClick(event) {
  const button = event.target.closest(".action-button");
  if (!button) return;

  const actionKey = button.dataset.action;
  performAction(actionKey);
}

// -------------------------
// Init
// -------------------------

window.addEventListener("DOMContentLoaded", () => {
  actionsRow.addEventListener("click", handleActionClick);

  // Set up custom cursor element inside environment frame
  if (environmentFrame) {
    customCursorEl = document.createElement("img");
    customCursorEl.src = POINTER_URL;
    customCursorEl.alt = "";
    customCursorEl.className = "custom-cursor";
    environmentFrame.appendChild(customCursorEl);

    // Hotspot click handling
    environmentFrame.addEventListener("click", (event) => {
      const hotspot = event.target.closest(".hotspot");
      if (!hotspot) return;
      const actionKey = hotspot.dataset.actionKey;
      if (actionKey) {
        performAction(actionKey);
      }
    });

    // Cursor movement + hover label
    environmentFrame.addEventListener("mousemove", (event) => {
      const frameRect = environmentFrame.getBoundingClientRect();

      // Move custom cursor
      if (customCursorEl) {
        const cx = event.clientX - frameRect.left;
        const cy = event.clientY - frameRect.top;
        customCursorEl.style.left = `${cx}px`;
        customCursorEl.style.top = `${cy}px`;
        customCursorEl.style.display = "block";
      }

      // Show/hide label based on hotspot under cursor
      if (hoverLabel) {
        const hotspot = event.target.closest(".hotspot");
        if (hotspot && hotspot.dataset.hoverText) {
          hoverLabel.textContent = hotspot.dataset.hoverText;
          hoverLabel.classList.add("is-visible");

          const hotRect = hotspot.getBoundingClientRect();
          const centerX = hotRect.left + hotRect.width / 2 - frameRect.left;
          // previously -18; now another 7px up => -25
          const tentativeTop = hotRect.top - frameRect.top - 25;
          const top = Math.max(tentativeTop, 0);

          hoverLabel.style.left = `${centerX}px`;
          hoverLabel.style.top = `${top}px`;
        } else {
          hoverLabel.classList.remove("is-visible");
        }
      }
    });

    environmentFrame.addEventListener("mouseleave", () => {
      if (customCursorEl) {
        customCursorEl.style.display = "none";
      }
      if (hoverLabel) {
        hoverLabel.classList.remove("is-visible");
      }
    });
  }

  // Song list item selection
  if (songListContainer) {
    songListContainer.addEventListener("click", (event) => {
      const btn = event.target.closest(".song-list-item");
      if (!btn) return;
      const songId = btn.dataset.songId;
      hideSongListOverlay();
      playSongById(songId);
    });
  }

  // Close button for song list
  if (songListCloseBtn) {
    songListCloseBtn.addEventListener("click", () => {
      hideSongListOverlay();
    });
  }

  if (currentSongId) {
    setCurrentSong(currentSongId);
  }

  // Initial entry already in HTML: "You step into the bar."
  // We set up the bar state without adding another log entry.
  goToRoom("bar", { initial: true });
  setSongDetailsVisible(false);
});
