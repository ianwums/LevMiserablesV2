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
const muteButton = document.getElementById("mute-button");
const trophyTitleEl = document.getElementById("trophy-title");
const drinkMenu = document.getElementById("drink-menu");

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
const JAGERBOMB_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/Ja%CC%88gerbombPixel.png";
const POINTER_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/UI_Elements/pointer.gif";

// Karaoke songs from songs.js
const SONG_LIST = (window.KARAOKE_SONGS || []).slice();
const SONGS_BY_ID = {};
SONG_LIST.forEach((song) => {
  SONGS_BY_ID[song.id] = song;
});

// End-of-song log messages
const KARAOKE_END_LOG_MESSAGES = [
  "The crowd go wild",
  "The room is notably emptier than before you sang",
  "You might not sing again after that performance",
  "Mary seems to have stuffed tissue in her ears",
  "That's My Dad!"
];

let lastKaraokeEndIndex = null;

// Hotspots
const HOTSPOTS = {
  bar: [
    {
      id: "bar-order-drink",
      // centre: (200, 400) => top-left (175, 375)
      xPercent: 21.875,
      yPercent: 62.5,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Order drink",
      actionKey: "order-drink"
    },
    {
      id: "bar-karaoke-room",
      // centre: (650, 50) => top-left (625, 25)
      xPercent: 78.125,
      yPercent: 4.1667,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Karaoke Room",
      actionKey: "go-karaoke"
    }
  ],
  karaoke: [
    {
      id: "karaoke-pick-song",
      // centre: (647, 514)
      xPercent: 77.75,
      yPercent: 81.5,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Pick a song",
      actionKey: "open-song-list"
    },
    {
      id: "karaoke-back-to-bar",
      // centre: (75, 50)
      xPercent: 6.25,
      yPercent: 4.1667,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Back to Bar",
      actionKey: "back-to-bar"
    }
  ]
};

// State
let currentRoom = "bar";
let trophyCount = 0;
let currentAudio = null;
let customCursorEl = null;
let isMuted = false;

// -------------------------
// Utilities
// -------------------------

function appendToLog(text) {
  const li = document.createElement("li");
  li.textContent = text;

  if (actionLog.firstChild) {
    actionLog.insertBefore(li, actionLog.firstChild);
  } else {
    actionLog.appendChild(li);
  }

  actionLog.scrollTop = 0;
}

function getTotalTrophies() {
  return trophyCount;
}

function updateTrophyTitle() {
  if (!trophyTitleEl) return;
  const total = getTotalTrophies();
  trophyTitleEl.textContent = `TROPHIES: ${total}`;
}

// Generic trophy helper – can be reused for other items later
function addTrophyIcon(src, alt) {
  trophyCount += 1;
  updateTrophyTitle();

  const slot = document.createElement("div");
  slot.className = "drink-slot";

  const img = document.createElement("img");
  img.className = "drink-image";
  img.src = src;
  img.alt = alt;

  slot.appendChild(img);
  iconRow.appendChild(slot);
}

// Floating pint visual in environment, cross-fade full -> empty -> fade out
function showFloatingPint() {
  if (!environmentFrame) return;

  const wrapper = document.createElement("div");
  wrapper.className = "environment-pint-float";

  const fullImg = document.createElement("img");
  fullImg.src = FULL_PINT_URL;
  fullImg.alt = "Pint of Guinness";
  fullImg.className = "environment-pint-full";

  const emptyImg = document.createElement("img");
  emptyImg.src = EMPTY_PINT_URL;
  emptyImg.alt = "Empty glass";
  emptyImg.className = "environment-pint-empty";

  wrapper.appendChild(fullImg);
  wrapper.appendChild(emptyImg);
  environmentFrame.appendChild(wrapper);

  // After 3 seconds, cross-fade full -> empty
  setTimeout(() => {
    fullImg.classList.add("is-fading");
    emptyImg.classList.add("is-visible");
  }, 3000);

  // Start fading the whole wrapper near the end of the empty phase
  setTimeout(() => {
    wrapper.classList.add("fade-out");
  }, 5500);

  // Remove after ~6.3s total
  setTimeout(() => {
    wrapper.remove();
  }, 6300);
}

// Jägerbomb: just fade away (no empty glass)
function showFloatingJagerbomb() {
  if (!environmentFrame) return;

  const wrapper = document.createElement("div");
  wrapper.className = "environment-pint-float";

  const img = document.createElement("img");
  img.src = JAGERBOMB_URL;
  img.alt = "Jägerbomb";
  img.className = "environment-pint-full";

  wrapper.appendChild(img);
  environmentFrame.appendChild(wrapper);

  // Fade out after a short time
  setTimeout(() => {
    wrapper.classList.add("fade-out");
  }, 2500);

  setTimeout(() => {
    wrapper.remove();
  }, 3300);
}

function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
}

function updateMuteButton() {
  if (!muteButton) return;
  if (isMuted) {
    muteButton.textContent = "🔇 Muted";
    muteButton.setAttribute("aria-pressed", "true");
  } else {
    muteButton.textContent = "🔊 Sound On";
    muteButton.setAttribute("aria-pressed", "false");
  }
  if (currentAudio) {
    currentAudio.muted = isMuted;
  }
}

function updateEnvironmentHeightVar() {
  if (!environmentFrame) return;
  const h = environmentFrame.clientHeight;
  if (h > 0) {
    document.documentElement.style.setProperty("--env-height", `${h}px`);
  }
}

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

  const titleText = song.title.toUpperCase();
  const artistText = song.artist.toUpperCase();

  songTitleEl.textContent = titleText;
  songArtistEl.textContent = artistText;
  adjustSongFontSizes(titleText);
}

function setSongDetailsVisible(visible) {
  karaokeSongDetails.style.display = visible ? "flex" : "none";
}

function clearHoverUI() {
  if (hoverLabel) {
    hoverLabel.classList.remove("is-visible");
  }
}

// -------------------------
// Hotspots
// -------------------------

function renderHotspotsForRoom(roomId) {
  if (!environmentFrame) return;

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
// Drinks menu helpers
// -------------------------

function showDrinkMenu() {
  if (!drinkMenu) return;
  drinkMenu.classList.add("is-visible");
}

function hideDrinkMenu() {
  if (!drinkMenu) return;
  drinkMenu.classList.remove("is-visible");
}

// Handle a specific drink choice
function handleDrinkChoice(drinkId) {
  if (currentRoom !== "bar") return;
  hideDrinkMenu();

  if (drinkId === "guinness") {
    appendToLog("You order a pint of Guinness.");
    dialogueText.textContent = "Guinness. A classic choice.";
    addTrophyIcon(FULL_PINT_URL, "Pint of Guinness");
    showFloatingPint();
  } else if (drinkId === "jagerbomb") {
    appendToLog("You order a Jägerbomb.");
    dialogueText.textContent =
      "Red Bull, mystery liqueur and bad decisions. Excellent.";
    addTrophyIcon(JAGERBOMB_URL, "Jägerbomb");
    showFloatingJagerbomb();
  }
}

// -------------------------
// Room transitions
// -------------------------

function goToRoom(room, options = {}) {
  const { initial = false } = options;
  currentRoom = room;

  clearHoverUI();
  hideDrinkMenu();

  if (room === "bar") {
    locationNameEl.textContent = "THE UNION - BAR AREA";
    environmentBaseImg.src = BAR_IMAGE;

    if (!initial) {
      appendToLog("To the bar!");
    }

    dialogueText.textContent =
      "Mags and Steve are behind the bar. It's going to be a good night.";

    stopCurrentAudio();
    setSongDetailsVisible(false);
    hideSongListOverlay();
  } else if (room === "karaoke") {
    locationNameEl.textContent = "THE UNION - KARAOKE ROOM";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;
    appendToLog("You step into the karaoke room.");
    dialogueText.textContent =
      "The baying mob approach Ronnie, song slips in hand.";
  }

  renderActions();
  renderHotspotsForRoom(room);
  updateEnvironmentHeightVar();
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
// Song list overlay helpers
// -------------------------

function renderSongList() {
  if (!songListContainer) return;

  songListContainer.innerHTML = "";

  const enabledSongs = SONG_LIST.filter((song) => song.enabled !== false);
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

function getActionsForRoom() {
  if (currentRoom === "bar") {
    return [{ key: "order-drink", label: "Order a drink" }];
  }
  return [];
}

function renderActions() {
  const actions = getActionsForRoom();
  const actionsPanel = actionsRow.closest(".actions-panel");

  actionsRow.innerHTML = "";

  if (!actions || actions.length === 0) {
    if (actionsPanel) {
      actionsPanel.style.display = "none";
    }
    return;
  }

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "action-button";
    button.dataset.action = action.key;
    button.textContent = action.label;
    actionsRow.appendChild(button);
  });

  if (actionsPanel) {
    actionsPanel.style.display = "";
  }
}

// -------------------------
// Karaoke song playback
// -------------------------

function playSongById(songId) {
  const song = SONGS_BY_ID[songId];
  if (!song) return;

  stopCurrentAudio();

  if (song.customDialogue && song.customDialogue.trim().length > 0) {
    appendToLog(
      `You select "${song.title}" by ${song.artist}, but Rockin Ronnie looks worried.`
    );
    dialogueText.textContent = song.customDialogue;
    return;
  }

  const hasAudio =
    song.mp3Url && typeof song.mp3Url === "string" && song.mp3Url.trim() !== "";

  setCurrentSong(song.id);
  setSongDetailsVisible(true);

  appendToLog(`You queue up "${song.title}" by ${song.artist}.`);
  dialogueText.textContent = getSelectDialogue(song);

  if (hasAudio) {
    const audio = new Audio(song.mp3Url);
    currentAudio = audio;
    currentAudio.muted = isMuted;

    audio.addEventListener("ended", () => {
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
  }
}

// -------------------------
// Action dispatcher
// -------------------------

function performAction(actionKey) {
  if (actionKey === "go-karaoke") {
    goToRoom("karaoke");
    return;
  }
  if (actionKey === "back-to-bar") {
    goToRoom("bar");
    return;
  }
  if (actionKey === "open-song-list" && currentRoom === "karaoke") {
    showSongListOverlay();
    return;
  }
  if (actionKey === "order-drink" && currentRoom === "bar") {
    showDrinkMenu();
    return;
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

  if (drinkMenu) {
    drinkMenu.addEventListener("click", (event) => {
      const btn = event.target.closest(".drink-menu-button");
      if (!btn) return;
      const drinkId = btn.dataset.drinkId;
      if (!drinkId) return;
      handleDrinkChoice(drinkId);
    });
  }

  if (muteButton) {
    muteButton.addEventListener("click", () => {
      isMuted = !isMuted;
      updateMuteButton();
    });
    updateMuteButton();
  }

  if (environmentFrame) {
    customCursorEl = document.createElement("img");
    customCursorEl.src = POINTER_URL;
    customCursorEl.alt = "";
    customCursorEl.className = "custom-cursor";
    environmentFrame.appendChild(customCursorEl);

    environmentFrame.addEventListener("click", (event) => {
      const hotspot = event.target.closest(".hotspot");
      if (!hotspot) return;
      const actionKey = hotspot.dataset.actionKey;
      if (actionKey) {
        performAction(actionKey);
      }
    });

    environmentFrame.addEventListener("mousemove", (event) => {
      const frameRect = environmentFrame.getBoundingClientRect();

      if (customCursorEl) {
        const cx = event.clientX - frameRect.left;
        const cy = event.clientY - frameRect.top;
        customCursorEl.style.left = `${cx}px`;
        customCursorEl.style.top = `${cy}px`;
        customCursorEl.style.display = "block";
      }

      if (hoverLabel) {
        const hotspot = event.target.closest(".hotspot");
        if (hotspot && hotspot.dataset.hoverText) {
          hoverLabel.textContent = hotspot.dataset.hoverText;
          hoverLabel.classList.add("is-visible");

          const hotRect = hotspot.getBoundingClientRect();
          const centerX = hotRect.left + hotRect.width / 2 - frameRect.left;

          hoverLabel.style.left = `${centerX}px`;
          hoverLabel.style.top = `0px`;

          const labelRect = hoverLabel.getBoundingClientRect();
          const labelHeight = labelRect.height || 0;

          const offsetAboveHotspot = 14;
          const desiredBottom =
            hotRect.top - frameRect.top - offsetAboveHotspot;
          let labelTop = desiredBottom - labelHeight;

          if (labelTop < 0) {
            labelTop = 0;
          }

          hoverLabel.style.left = `${centerX}px`;
          hoverLabel.style.top = `${labelTop}px`;
        } else {
          hoverLabel.classList.remove("is-visible");
        }
      }
    });

    environmentFrame.addEventListener("mouseleave", () => {
      if (customCursorEl) {
        customCursorEl.style.display = "none";
      }
      clearHoverUI();
    });
  }

  if (songListContainer) {
    songListContainer.addEventListener("click", (event) => {
      const btn = event.target.closest(".song-list-item");
      if (!btn) return;
      const songId = btn.dataset.songId;
      hideSongListOverlay();
      playSongById(songId);
    });
  }

  if (songListCloseBtn) {
    songListCloseBtn.addEventListener("click", () => {
      hideSongListOverlay();
    });
  }

  updateEnvironmentHeightVar();
  window.addEventListener("resize", updateEnvironmentHeightVar);
  if (environmentBaseImg) {
    environmentBaseImg.addEventListener("load", updateEnvironmentHeightVar);
  }

  goToRoom("bar", { initial: true });
  setSongDetailsVisible(false);
  updateTrophyTitle(); // initialise TROPHIES: 0
});
