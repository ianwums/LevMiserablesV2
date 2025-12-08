// =========================
// DOM REFERENCES
// =========================

const actionLog = document.getElementById("action-log");
const dialogueText = document.getElementById("dialogue-text");
const environmentBaseImg = document.getElementById("environment-base");
const karaokeSongDetails = document.getElementById("karaoke-song-details");
const actionsPanel = document.getElementById("actions-panel");
const actionsRow = document.getElementById("actions-row");
const iconRow = document.getElementById("icon-row");
const locationNameEl = document.getElementById("location-name");
const songTitleEl = document.querySelector(".song-title");
const songArtistEl = document.querySelector(".song-artist");
const environmentFrame = document.getElementById("environment-frame");
const hoverLabel = document.getElementById("environment-hover-label");
const drunknessDisplay = document.getElementById("drunkness-display");
const muteToggleBtn = document.getElementById("mute-toggle");
const gameOverOverlay = document.getElementById("game-over-overlay");
const restartButton = document.getElementById("restart-button");
const trophiesTitle = document.getElementById("trophies-title");

// Song list overlay
const songListOverlay = document.getElementById("song-list-overlay");
const songListContainer = document.getElementById("song-list-container");
const songListCloseBtn = document.getElementById("song-list-close");

// Map hover card
const locationCard = document.getElementById("location-hover-card");
const locationCardTitle = document.getElementById("location-card-title");
const locationCardImage = document.getElementById("location-card-image");
const locationCardPlaceholder = document.getElementById(
  "location-card-placeholder"
);

// =========================
// CONSTANTS / ASSETS
// =========================

const MAP_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/mvpfullmap.png";
const BAR_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/unionbarpixel.png";
const KARAOKE_ROOM_IMAGE =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/KaraokeRoomPixel.png";

const FULL_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_full.gif";
const EMPTY_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_empty.gif";
const JAEGER_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/Ja%CC%88gerbombPixel.png";

const POINTER_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/UI_Elements/pointer.gif";

const HOME_ICON_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/locationicons/homeiconpix.png";

const DRUNKNESS_LIMIT = 10;

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

// Guinness random dialogue lines
const GUINNESS_DIALOGUE_OPTIONS = [
  "Mags hands you a Guinness topped with a Musical Note.",
  "Mags hands you a Guinness topped with a Shamrock.",
  "Mags hands you a Guinness topped with a Heart.",
  "Mags hands you a Guinness topped with MUFC."
];

// =========================
// HOTSPOTS
// =========================

function hotspotFromCenter(x, y, diameter) {
  const r = diameter / 2;
  const left = x - r;
  const top = y - r;
  return {
    xPercent: (left / 800) * 100,
    yPercent: (top / 600) * 100,
    widthPercent: (diameter / 800) * 100,
    heightPercent: (diameter / 600) * 100
  };
}

const HOTSPOTS = {
  map: [
    (() => {
      const d = 22;
      const defs = [
        ["map-bakery", 147, 17, "map-closed"],
        ["map-station-hop", 160, 208, "map-closed"],
        ["map-ny-krispy", 196, 266, "map-closed"],
        ["map-union-inn", 196, 298, "go-union-bar"],
        ["map-overdraught", 192, 328, "map-closed"],
        ["map-tesco", 208, 430, "map-closed"],
        ["map-atm", 222, 457, "map-closed"],
        ["map-levenshulme", 258, 504, "map-closed"],
        ["map-talleyrand", 244, 524, "map-closed"],
        ["map-isca", 258, 552, "map-closed"],
        ["map-antiques", 278, 539, "map-closed"],
        ["map-nordie", 264, 578, "map-closed"],
        ["map-station-south", 299, 581, "map-closed"],
        ["map-home", 59, 384, "map-closed"],
        ["map-long-bois", 15, 442, "map-closed"],
        ["map-blue-bell", 525, 225, "map-closed"],
        ["map-trawlers-2", 688, 163, "map-closed"]
      ];

      return defs.map(([id, x, y, actionKey]) => {
        const b = hotspotFromCenter(x, y, d);
        return {
          id,
          actionKey,
          xPercent: b.xPercent,
          yPercent: b.yPercent,
          widthPercent: b.widthPercent,
          heightPercent: b.heightPercent
        };
      });
    })()
  ].flat(),

  bar: [
    (() => {
      const d = 50;
      const b = hotspotFromCenter(200, 400, d);
      return {
        id: "bar-order-drink",
        xPercent: b.xPercent,
        yPercent: b.yPercent,
        widthPercent: b.widthPercent,
        heightPercent: b.heightPercent,
        hoverText: "Order drink",
        actionKey: "order-drink"
      };
    })(),
    (() => {
      const d = 50;
      const b = hotspotFromCenter(650, 50, d);
      return {
        id: "bar-karaoke-room",
        xPercent: b.xPercent,
        yPercent: b.yPercent,
        widthPercent: b.widthPercent,
        heightPercent: b.heightPercent,
        hoverText: "Karaoke Room",
        actionKey: "go-karaoke"
      };
    })()
  ],

  karaoke: [
    (() => {
      const d = 50;
      const b = hotspotFromCenter(75, 50, d);
      return {
        id: "karaoke-back-bar",
        xPercent: b.xPercent,
        yPercent: b.yPercent,
        widthPercent: b.widthPercent,
        heightPercent: b.heightPercent,
        hoverText: "Back to Bar",
        actionKey: "back-to-bar"
      };
    })(),
    (() => {
      const d = 50;
      const b = hotspotFromCenter(647, 514, d);
      return {
        id: "karaoke-pick-song",
        xPercent: b.xPercent,
        yPercent: b.yPercent,
        widthPercent: b.widthPercent,
        heightPercent: b.heightPercent,
        hoverText: "Pick a song",
        actionKey: "open-song-list"
      };
    })()
  ]
};

// =========================
// MAP LOCATION METADATA
// =========================

const MAP_LOCATION_INFO = {
  "map-bakery": {
    title: "Levenshulme Bakery",
    cardCenterX: 147,
    cardCenterY: 17
  },
  "map-station-hop": {
    title: "Station Hop",
    cardCenterX: 160,
    cardCenterY: 208
  },
  "map-ny-krispy": {
    title: "New York Krispy",
    cardCenterX: 196,
    cardCenterY: 266
  },
  "map-union-inn": {
    title: "Union Inn",
    cardCenterX: 196,
    cardCenterY: 298
  },
  "map-overdraught": {
    title: "OverDraught",
    cardCenterX: 192,
    cardCenterY: 328
  },
  "map-tesco": {
    title: "Tesco Superstore",
    cardCenterX: 208,
    cardCenterY: 430
  },
  "map-atm": {
    title: "ATM",
    cardCenterX: 222,
    cardCenterY: 457
  },
  "map-levenshulme": {
    title: "The Levenshulme",
    cardCenterX: 258,
    cardCenterY: 504
  },
  "map-talleyrand": {
    title: "The Talleyrand",
    cardCenterX: 244,
    cardCenterY: 524
  },
  "map-isca": {
    title: "Isca",
    cardCenterX: 258,
    cardCenterY: 552
  },
  "map-antiques": {
    title: "Levenshulme Antiques Village",
    cardCenterX: 278,
    cardCenterY: 539
  },
  "map-nordie": {
    title: "Nordie",
    cardCenterX: 264,
    cardCenterY: 578
  },
  "map-station-south": {
    title: "Station South",
    cardCenterX: 299,
    cardCenterY: 581
  },
  "map-home": {
    title: "Home",
    imageUrl: HOME_ICON_URL,
    cardCenterX: 59,
    cardCenterY: 384
  },
  "map-long-bois": {
    title: "Long Boi's",
    cardCenterX: 15,
    cardCenterY: 442
  },
  "map-blue-bell": {
    title: "The Blue Bell Inn",
    cardCenterX: 525,
    cardCenterY: 225
  },
  "map-trawlers-2": {
    title: "Trawlers 2",
    cardCenterX: 688,
    cardCenterY: 163
  }
};

// =========================
// STATE
// =========================

let currentRoom = "map"; // "map" | "bar" | "karaoke"
let previousRoom = null;

let currentSongId = SONG_LIST.length ? SONG_LIST[0].id : null;
let drinkCount = 0;
let trophyCount = 0;
let drunkness = 0;
let currentAudio = null;
let isMuted = false;
let customCursorEl = null;
let lastKaraokeEndIndex = null;

// =========================
// UTILS
// =========================

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

function updateDrunknessDisplay() {
  if (drunknessDisplay) {
    drunknessDisplay.textContent = `Drunkness: ${drunkness}`;
  }
}

function updateTrophiesTitle() {
  if (trophiesTitle) {
    trophiesTitle.textContent = `TROPHIES: ${trophyCount}`;
  }
}

function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
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

function clearHoverUI() {
  if (hoverLabel) {
    hoverLabel.classList.remove("is-visible");
  }
}

// Map hover card helpers
function hideLocationCard() {
  if (locationCard) {
    locationCard.style.display = "none";
  }
}

function showLocationCardFor(info) {
  if (!locationCard || !locationCardTitle || !environmentFrame) return;

  const frameRect = environmentFrame.getBoundingClientRect();

  // Base position from hotspot centre (0–800 / 0–600 -> frame size)
  const baseX = (info.cardCenterX / 800) * frameRect.width;
  const baseY = (info.cardCenterY / 600) * frameRect.height;

  // Offset card above or below hotspot depending on whether it's in
  // the top or bottom half of the map.
  const verticalOffset = frameRect.height * 0.1; // 10% of frame height
  let x = baseX;
  let y = baseY + (info.cardCenterY < 300 ? verticalOffset : -verticalOffset);

  // Approximate card size as a fraction of frame size for clamping
  const approxCardWidth = frameRect.width * 0.3;  // ~30% of width
  const approxCardHeight = frameRect.height * 0.23; // ~23% of height
  const halfW = approxCardWidth / 2;
  const halfH = approxCardHeight / 2;

  const minX = halfW;
  const maxX = frameRect.width - halfW;
  const minY = halfH;
  const maxY = frameRect.height - halfH;

  if (x < minX) x = minX;
  if (x > maxX) x = maxX;
  if (y < minY) y = minY;
  if (y > maxY) y = maxY;

  locationCard.style.left = `${x}px`;
  locationCard.style.top = `${y}px`;

  locationCardTitle.textContent = info.title;

  if (info.imageUrl && locationCardImage) {
    locationCardImage.src = info.imageUrl;
    locationCardImage.style.display = "block";
    if (locationCardPlaceholder) {
      locationCardPlaceholder.style.display = "none";
    }
  } else {
    if (locationCardImage) {
      locationCardImage.style.display = "none";
    }
    if (locationCardPlaceholder) {
      locationCardPlaceholder.style.display = "flex";
    }
  }

  locationCard.style.display = "block";
}

// =========================
// HOTSPOT RENDERING
// =========================

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
    if (h.id) {
      el.id = h.id;
    }

    el.style.left = `${h.xPercent}%`;
    el.style.top = `${h.yPercent}%`;
    el.style.width = `${h.widthPercent}%`;
    el.style.height = `${h.heightPercent}%`;

    environmentFrame.appendChild(el);
  });
}

// =========================
// ROOM TRANSITIONS
// =========================

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

function setSongDetailsVisible(visible) {
  karaokeSongDetails.style.display = visible ? "flex" : "none";
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

function clearActions() {
  actionsRow.innerHTML = "";
  actionsPanel.classList.remove("has-actions");
}

function goToRoom(room, options = {}) {
  const { initial = false } = options;

  previousRoom = currentRoom;
  currentRoom = room;

  clearHoverUI();
  hideLocationCard();
  stopCurrentAudio();
  setSongDetailsVisible(false);
  hideSongListOverlay();
  clearActions();

  if (environmentFrame) {
    if (room === "map") {
      environmentFrame.classList.add("map-mode");
    } else {
      environmentFrame.classList.remove("map-mode");
    }
  }

  if (room === "map") {
    locationNameEl.textContent = "MAP";
    environmentBaseImg.src = MAP_IMAGE;
    if (!initial) {
      appendToLog("You return to the map.");
    }
    dialogueText.textContent = "Where will you start tonight?";
  } else if (room === "bar") {
    locationNameEl.textContent = "THE UNION - BAR AREA";
    environmentBaseImg.src = BAR_IMAGE;

    if (!initial) {
      if (previousRoom === "map") {
        appendToLog(
          "You step into the Union with a mean thirst and a song to sing."
        );
      } else if (previousRoom === "karaoke") {
        appendToLog("To the bar!");
      }
    }

    dialogueText.textContent =
      "Mags and Steve are behind the bar. It's going to be a good night.";
  } else if (room === "karaoke") {
    locationNameEl.textContent = "THE UNION - KARAOKE ROOM";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;

    if (!initial) {
      appendToLog("The baying mob approach Ronnie, song slips in hand.");
    }

    dialogueText.textContent =
      "The baying mob approach Ronnie, song slips in hand.";
  }

  renderHotspotsForRoom(room);
}

// =========================
// SONG LIST OVERLAY
// =========================

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

// =========================
// DRINKS & TROPHIES
// =========================

function addDrinkIcon(type) {
  drinkCount += 1;
  trophyCount += 1;
  updateTrophiesTitle();

  const slot = document.createElement("div");
  slot.className = "drink-slot";

  const img = document.createElement("img");
  img.className = "drink-image";

  if (type === "jaeger") {
    img.src = JAEGER_URL;
    img.alt = `Jägerbomb #${drinkCount}`;
  } else {
    img.src = FULL_PINT_URL;
    img.alt = `Pint of stout #${drinkCount}`;
  }

  slot.appendChild(img);
  iconRow.appendChild(slot);
}

function spawnDrinkOnBar(type) {
  if (!environmentFrame) return;

  const fullImg = document.createElement("img");
  fullImg.className = "spawned-drink";
  fullImg.src = type === "jaeger" ? JAEGER_URL : FULL_PINT_URL;

  const spawnX = 108;
  const spawnY = 462;

  fullImg.style.left = `${(spawnX / 800) * 100}%`;
  fullImg.style.top = `${(spawnY / 600) * 100}%`;
  fullImg.style.opacity = "0";

  environmentFrame.appendChild(fullImg);

  requestAnimationFrame(() => {
    fullImg.classList.add("drink-fade-in");
  });

  if (type === "jaeger") {
    setTimeout(() => {
      fullImg.classList.remove("drink-fade-in");
      fullImg.classList.add("drink-fade-out");
    }, 3000);

    setTimeout(() => {
      fullImg.remove();
    }, 3400);
  } else {
    const emptyImg = document.createElement("img");
    emptyImg.className = "spawned-drink";
    emptyImg.src = EMPTY_PINT_URL;
    emptyImg.style.left = `${(spawnX / 800) * 100}%`;
    emptyImg.style.top = `${(spawnY / 600) * 100}%`;
    emptyImg.style.opacity = "0";
    environmentFrame.appendChild(emptyImg);

    setTimeout(() => {
      fullImg.classList.remove("drink-fade-in");
      fullImg.classList.add("drink-fade-out");
      emptyImg.classList.add("drink-fade-in");
    }, 3000);

    setTimeout(() => {
      emptyImg.classList.remove("drink-fade-in");
      emptyImg.classList.add("drink-fade-out");
    }, 6000);

    setTimeout(() => {
      fullImg.remove();
      emptyImg.remove();
    }, 6400);
  }
}

function incrementDrunkness() {
  drunkness += 1;
  updateDrunknessDisplay();
  if (drunkness >= DRUNKNESS_LIMIT) {
    stopCurrentAudio();
    showGameOverOverlay();
  }
}

function handleDrinkConsumed(type) {
  addDrinkIcon(type);
  spawnDrinkOnBar(type);
  incrementDrunkness();
}

// =========================
// KARAOKE SONG PLAYBACK
// =========================

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
    audio.muted = isMuted;
    currentAudio = audio;

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

// =========================
// GAME OVER
// =========================

function showGameOverOverlay() {
  if (gameOverOverlay) {
    gameOverOverlay.classList.add("is-visible");
  }
}

function hideGameOverOverlay() {
  if (gameOverOverlay) {
    gameOverOverlay.classList.remove("is-visible");
  }
}

function resetGameState() {
  stopCurrentAudio();
  drunkness = 0;
  drinkCount = 0;
  trophyCount = 0;
  updateDrunknessDisplay();
  updateTrophiesTitle();

  actionLog.innerHTML = "";
  iconRow.innerHTML = "";

  appendToLog("You unfold the map of Levenshulme.");
  dialogueText.textContent = "Where will you start tonight?";

  hideGameOverOverlay();
  goToRoom("map", { initial: true });
}

// =========================
// ACTIONS
// =========================

function showDrinkMenu() {
  clearActions();

  const guinnessBtn = document.createElement("button");
  guinnessBtn.className = "action-button";
  guinnessBtn.dataset.action = "order-guinness";
  guinnessBtn.textContent = "Pint of Guinness";

  const jaegerBtn = document.createElement("button");
  jaegerBtn.className = "action-button";
  jaegerBtn.dataset.action = "order-jaeger";
  jaegerBtn.textContent = "Jägerbomb";

  actionsRow.appendChild(guinnessBtn);
  actionsRow.appendChild(jaegerBtn);
  actionsPanel.classList.add("has-actions");
}

function performAction(actionKey) {
  if (actionKey === "go-union-bar") {
    goToRoom("bar");
    return;
  }
  if (actionKey === "go-karaoke") {
    goToRoom("karaoke");
    return;
  }
  if (actionKey === "back-to-bar") {
    goToRoom("bar");
    return;
  }

  if (actionKey === "map-closed") {
    appendToLog("Looks like they are closed.");
    dialogueText.textContent = "Looks like they are closed.";
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

  if (actionKey === "order-guinness") {
    const line =
      GUINNESS_DIALOGUE_OPTIONS[
        Math.floor(Math.random() * GUINNESS_DIALOGUE_OPTIONS.length)
      ];
    appendToLog(line);
    dialogueText.textContent = line;
    handleDrinkConsumed("guinness");
    clearActions();
    return;
  }

  if (actionKey === "order-jaeger") {
    const line = "You order a Jägerbomb. Julie looks on approvingly.";
    appendToLog(line);
    dialogueText.textContent = line;
    handleDrinkConsumed("jaeger");
    clearActions();
    return;
  }
}

function handleActionClick(event) {
  const button = event.target.closest(".action-button");
  if (!button) return;
  const actionKey = button.dataset.action;
  performAction(actionKey);
}

// =========================
// INIT
// =========================

window.addEventListener("DOMContentLoaded", () => {
  actionsRow.addEventListener("click", handleActionClick);

  if (restartButton) {
    restartButton.addEventListener("click", resetGameState);
  }

  if (muteToggleBtn) {
    muteToggleBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      if (currentAudio) {
        currentAudio.muted = isMuted;
      }
      muteToggleBtn.textContent = isMuted ? "🔇 Muted" : "🔊 Sound On";
    });
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

      const hotspot = event.target.closest(".hotspot");

      if (currentRoom === "map") {
        clearHoverUI();

        if (hotspot && hotspot.id && MAP_LOCATION_INFO[hotspot.id]) {
          showLocationCardFor(MAP_LOCATION_INFO[hotspot.id]);
        } else {
          hideLocationCard();
        }
      } else {
        hideLocationCard();

        if (hoverLabel && hotspot && hotspot.dataset.hoverText) {
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
        } else if (hoverLabel) {
          hoverLabel.classList.remove("is-visible");
        }
      }
    });

    environmentFrame.addEventListener("mouseleave", () => {
      if (customCursorEl) {
        customCursorEl.style.display = "none";
      }
      clearHoverUI();
      hideLocationCard();
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

  if (currentSongId) {
    setCurrentSong(currentSongId);
  }

  updateDrunknessDisplay();
  updateTrophiesTitle();

  appendToLog("You unfold the map of Levenshulme.");
  goToRoom("map", { initial: true });
});
