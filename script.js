// -------------------------
// DOM REFERENCES
// -------------------------

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
const songListOverlay = document.getElementById("song-list-overlay");
const songListContainer = document.getElementById("song-list-container");
const songListCloseBtn = document.getElementById("song-list-close");
const drunknessDisplay = document.getElementById("drunkness-display");
const muteToggleBtn = document.getElementById("mute-toggle");
const gameOverOverlay = document.getElementById("game-over-overlay");
const restartButton = document.getElementById("restart-button");
const trophiesTitle = document.getElementById("trophies-title");

// Map hover card DOM
const locationCard = document.getElementById("location-hover-card");
const locationCardTitle = document.getElementById("location-card-title");
const locationCardImage = document.getElementById("location-card-image");

// -------------------------
// CONSTANTS / ASSETS
// -------------------------

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

// Karaoke songs from songs.js
const SONG_LIST = (window.KARAOKE_SONGS || []).slice();
const SONGS_BY_ID = {};
SONG_LIST.forEach((song) => {
  SONGS_BY_ID[song.id] = song;
});

// End-of-song history messages (no immediate repeats)
const KARAOKE_END_LOG_MESSAGES = [
  "The crowd go wild",
  "The room is notably emptier than before you sang",
  "You might not sing again after that performance",
  "Mary seems to have stuffed tissue in her ears",
  "That's My Dad!"
];
let lastKaraokeEndIndex = null;

// Random Guinness order dialogue
const GUINNESS_DIALOGUE_OPTIONS = [
  "Mags hands you a Guinness topped with a Musical Note.",
  "Mags hands you a Guinness topped with a Shamrock.",
  "Mags hands you a Guinness topped with a Heart.",
  "Mags hands you a Guinness topped with MUFC."
];

// -------------------------
// HOTSPOTS
// -------------------------

// Default hotspot size for bar/karaoke: 50x50px
const HOTSPOT_SIZE = {
  widthPercent: (50 / 800) * 100,
  heightPercent: (50 / 600) * 100
};

// Map hotspots: 22x22px
const MAP_HOTSPOT_WIDTH_PERCENT = (22 / 800) * 100;
const MAP_HOTSPOT_HEIGHT_PERCENT = (22 / 600) * 100;

const HOTSPOTS = {
  // MAP: using provided 800x600 centre coordinates
  map: [
    {
      id: "map-bakery", // Levenshulme Bakery 147,17
      xPercent: ((147 - 11) / 800) * 100,
      yPercent: ((17 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Levenshulme Bakery",
      actionKey: "map-closed"
    },
    {
      id: "map-station-hop", // 160,208
      xPercent: ((160 - 11) / 800) * 100,
      yPercent: ((208 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Station Hop",
      actionKey: "map-closed"
    },
    {
      id: "map-ny-krispy", // 196,266
      xPercent: ((196 - 11) / 800) * 100,
      yPercent: ((266 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "New York Krispy",
      actionKey: "map-closed"
    },
    {
      id: "map-union-inn", // 196,298
      xPercent: ((196 - 11) / 800) * 100,
      yPercent: ((298 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Union Inn",
      actionKey: "go-union-from-map"
    },
    {
      id: "map-overdraught", // 192,328
      xPercent: ((192 - 11) / 800) * 100,
      yPercent: ((328 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "OverDraught",
      actionKey: "map-closed"
    },
    {
      id: "map-home", // 59,384
      xPercent: ((59 - 11) / 800) * 100,
      yPercent: ((384 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Home",
      actionKey: "map-closed"
    },
    {
      id: "map-long-bois", // 15,442
      xPercent: ((15 - 11) / 800) * 100,
      yPercent: ((442 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Long Boi's",
      actionKey: "map-closed"
    },
    {
      id: "map-tesco", // 208,430
      xPercent: ((208 - 11) / 800) * 100,
      yPercent: ((430 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Tesco Superstore",
      actionKey: "map-closed"
    },
    {
      id: "map-atm", // 222,457
      xPercent: ((222 - 11) / 800) * 100,
      yPercent: ((457 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "ATM",
      actionKey: "map-closed"
    },
    {
      id: "map-levenshulme", // 258,504
      xPercent: ((258 - 11) / 800) * 100,
      yPercent: ((504 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "The Levenshulme",
      actionKey: "map-closed"
    },
    {
      id: "map-talleyrand", // 244,524
      xPercent: ((244 - 11) / 800) * 100,
      yPercent: ((524 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "The Talleyrand",
      actionKey: "map-closed"
    },
    {
      id: "map-isca", // 258,552
      xPercent: ((258 - 11) / 800) * 100,
      yPercent: ((552 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Isca",
      actionKey: "map-closed"
    },
    {
      id: "map-antiques", // 278,539
      xPercent: ((278 - 11) / 800) * 100,
      yPercent: ((539 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Levenshulme Antiques Village",
      actionKey: "map-closed"
    },
    {
      id: "map-nordie", // 264,578
      xPercent: ((264 - 11) / 800) * 100,
      yPercent: ((578 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Nordie",
      actionKey: "map-closed"
    },
    {
      id: "map-station-south", // 299,581
      xPercent: ((299 - 11) / 800) * 100,
      yPercent: ((581 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Station South",
      actionKey: "map-closed"
    },
    {
      id: "map-blue-bell", // 525,225
      xPercent: ((525 - 11) / 800) * 100,
      yPercent: ((225 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "The Blue Bell Inn",
      actionKey: "map-closed"
    },
    {
      id: "map-trawlers-2", // 688,163
      xPercent: ((688 - 11) / 800) * 100,
      yPercent: ((163 - 11) / 600) * 100,
      widthPercent: MAP_HOTSPOT_WIDTH_PERCENT,
      heightPercent: MAP_HOTSPOT_HEIGHT_PERCENT,
      hoverText: "Trawlers 2",
      actionKey: "map-closed"
    }
  ],

  // UNION – BAR AREA
  bar: [
    {
      id: "bar-order-drink",
      xPercent: ((200 - 25) / 800) * 100,
      yPercent: ((400 - 25) / 600) * 100,
      hoverText: "Order drink",
      actionKey: "order-drink"
    },
    {
      id: "bar-karaoke-room",
      xPercent: ((650 - 25) / 800) * 100,
      yPercent: ((50 - 25) / 600) * 100,
      hoverText: "Karaoke Room",
      actionKey: "go-karaoke"
    },
    {
      id: "bar-exit-to-map",
      xPercent: ((455 - 25) / 800) * 100,
      yPercent: ((345 - 25) / 600) * 100,
      hoverText: "Back to map",
      actionKey: "back-to-map"
    }
  ],

  // UNION – KARAOKE ROOM
  karaoke: [
    {
      id: "karaoke-back-bar",
      xPercent: ((75 - 25) / 800) * 100,
      yPercent: ((50 - 25) / 600) * 100,
      hoverText: "Back to bar",
      actionKey: "back-to-bar"
    },
    {
      id: "karaoke-pick-song",
      xPercent: ((647 - 25) / 800) * 100,
      yPercent: ((514 - 25) / 600) * 100,
      hoverText: "Pick a song",
      actionKey: "open-song-list"
    }
  ]
};

// Map location metadata for hover cards (only HOME for now)
const MAP_LOCATION_INFO = {
  "map-home": {
    title: "HOME",
    imageUrl: HOME_ICON_URL,
    // Card centre in 800x600 coords (roughly matching your mock)
    cardCenterX: 270,
    cardCenterY: 300
  }
};

// -------------------------
// STATE
// -------------------------

let currentRoom = "map"; // "map" | "bar" | "karaoke"
let currentSongId = SONG_LIST.length ? SONG_LIST[0].id : null;
let currentAudio = null;
let isMuted = false;
let drinkCount = 0;
let drinkTrophyCount = 0;
let drunkness = 0;
let isGameOver = false;
let customCursorEl = null;

// -------------------------
// UTILITIES
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

function clearHoverUI() {
  if (hoverLabel) hoverLabel.classList.remove("is-visible");
}

function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }
}

function getRandomFromArray(arr, lastIndexRef) {
  if (!arr || arr.length === 0) return null;
  if (arr.length === 1) return { value: arr[0], index: 0 };

  let index;
  do {
    index = Math.floor(Math.random() * arr.length);
  } while (lastIndexRef.value !== null && index === lastIndexRef.value);

  lastIndexRef.value = index;
  return { value: arr[index], index };
}

function updateTrophyTitle() {
  if (!trophiesTitle) return;
  trophiesTitle.textContent = `TROPHIES: ${drinkTrophyCount}`;
}

function updateDrunknessDisplay() {
  if (!drunknessDisplay) return;
  drunknessDisplay.textContent = `Drunkness: ${drunkness}`;
}

// -------------------------
// MAP HOVER CARD HELPERS
// -------------------------

function hideLocationCard() {
  if (locationCard) {
    locationCard.style.display = "none";
  }
}

function showLocationCardFor(info) {
  if (!locationCard || !locationCardTitle || !locationCardImage) return;
  if (!environmentFrame) return;

  const frameRect = environmentFrame.getBoundingClientRect();

  const x =
    (info.cardCenterX / 800) * frameRect.width; // 800x600 logical to pixels
  const y = (info.cardCenterY / 600) * frameRect.height;

  locationCard.style.left = `${x}px`;
  locationCard.style.top = `${y}px`;

  locationCardTitle.textContent = info.title;
  locationCardImage.src = info.imageUrl;

  locationCard.style.display = "block";
}

// -------------------------
// DRINKS / TROPHIES
// -------------------------

function addDrinkTrophy(imageUrl, altText) {
  drinkTrophyCount += 1;
  updateTrophyTitle();

  const slot = document.createElement("div");
  slot.className = "drink-slot";

  const img = document.createElement("img");
  img.className = "drink-image";
  img.src = imageUrl;
  img.alt = altText;

  slot.appendChild(img);
  iconRow.appendChild(slot);
}

function spawnDrinkOnBar(options) {
  if (!environmentFrame) return;
  const {
    fullUrl,
    emptyUrl,
    x = 108,
    y = 462,
    fullMs = 3000,
    emptyMs = 3000
  } = options;

  const img = document.createElement("img");
  img.src = fullUrl;
  img.alt = "";
  img.className = "spawned-drink";

  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  environmentFrame.appendChild(img);

  if (emptyUrl) {
    setTimeout(() => {
      img.classList.add("drink-fade-out");
      setTimeout(() => {
        img.src = EMPTY_PINT_URL;
        img.classList.remove("drink-fade-out");
        img.classList.add("drink-fade-in");

        setTimeout(() => {
          img.classList.remove("drink-fade-in");
          img.classList.add("drink-fade-out");
          setTimeout(() => img.remove(), emptyMs / 2);
        }, emptyMs);
      }, fullMs / 2);
    }, 0);
  } else {
    setTimeout(() => {
      img.classList.add("drink-fade-out");
      setTimeout(() => img.remove(), fullMs / 2);
    }, fullMs);
  }
}

function incrementDrunkness() {
  drunkness += 1;
  updateDrunknessDisplay();
  if (drunkness >= DRUNKNESS_LIMIT) {
    triggerGameOver();
  }
}

// -------------------------
// GAME OVER
// -------------------------

function triggerGameOver() {
  isGameOver = true;
  stopCurrentAudio();
  setSongDetailsVisible(false);
  hideSongListOverlay();
  hideLocationCard();
  if (gameOverOverlay) {
    gameOverOverlay.classList.add("is-visible");
  }
}

function resetGame() {
  currentRoom = "map";
  currentSongId = SONG_LIST.length ? SONG_LIST[0].id : null;
  currentAudio = null;
  isGameOver = false;
  drinkCount = 0;
  drinkTrophyCount = 0;
  drunkness = 0;
  updateDrunknessDisplay();
  updateTrophyTitle();

  if (iconRow) iconRow.innerHTML = "";
  if (actionLog) actionLog.innerHTML = "";
  if (actionsRow) actionsRow.innerHTML = "";
  if (actionsPanel) actionsPanel.classList.remove("has-actions");

  if (gameOverOverlay) gameOverOverlay.classList.remove("is-visible");

  goToRoom("map", { initial: true });
  appendToLog("You unfold the map of Levenshulme.");
  dialogueText.textContent = "Where will you start tonight?";
}

// -------------------------
// KARAOKE TEXT & SONGS
// -------------------------

function adjustSongFontSizes(titleText) {
  const len = titleText.length;
  let titleSizeRem;
  if (len <= 22) titleSizeRem = 0.75;
  else if (len <= 35) titleSizeRem = 0.7;
  else titleSizeRem = 0.6;

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

function getRandomKaraokeEndLogMessage() {
  const ref = { value: lastKaraokeEndIndex };
  const res = getRandomFromArray(KARAOKE_END_LOG_MESSAGES, ref);
  lastKaraokeEndIndex = ref.value;
  return res ? res.value : "";
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
// HOTSPOT RENDERING
// -------------------------

function renderHotspotsForRoom(roomId) {
  if (!environmentFrame) return;
  environmentFrame.querySelectorAll(".hotspot").forEach((el) => el.remove());

  const hotspots = HOTSPOTS[roomId] || [];
  hotspots.forEach((h) => {
    const el = document.createElement("button");
    el.className = "hotspot";
    el.dataset.actionKey = h.actionKey;
    if (h.id) el.id = h.id;

    // Only attach hover text for non-map rooms
    if (roomId !== "map" && h.hoverText) {
      el.dataset.hoverText = h.hoverText;
    }

    const widthPercent =
      typeof h.widthPercent === "number"
        ? h.widthPercent
        : HOTSPOT_SIZE.widthPercent;
    const heightPercent =
      typeof h.heightPercent === "number"
        ? h.heightPercent
        : HOTSPOT_SIZE.heightPercent;

    el.style.left = `${h.xPercent}%`;
    el.style.top = `${h.yPercent}%`;
    el.style.width = `${widthPercent}%`;
    el.style.height = `${heightPercent}%`;
    environmentFrame.appendChild(el);
  });
}

// -------------------------
// ROOMS
// -------------------------

function goToRoom(room, options = {}) {
  const { initial = false } = options;
  currentRoom = room;
  clearHoverUI();
  hideLocationCard();

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
      appendToLog("You step back to the map.");
      dialogueText.textContent =
        "Levenshulme spreads out before you, one pint at a time.";
    } else {
      dialogueText.textContent = "Where will you start tonight?";
    }

    stopCurrentAudio();
    setSongDetailsVisible(false);
    hideSongListOverlay();
  } else if (room === "bar") {
    locationNameEl.textContent = "THE UNION - BAR AREA";
    environmentBaseImg.src = BAR_IMAGE;

    if (!initial) {
      appendToLog("To the bar!");
    } else {
      appendToLog(
        "You step into the Union with a mean thirst and a song to sing."
      );
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

    stopCurrentAudio();
    setSongDetailsVisible(false);
    hideSongListOverlay();
  }

  renderHotspotsForRoom(room);
}

// -------------------------
// ACTIONS
// -------------------------

function ensureActionsPanelVisible(show) {
  if (!actionsPanel) return;
  if (show) actionsPanel.classList.add("has-actions");
  else actionsPanel.classList.remove("has-actions");
}

function clearActions() {
  actionsRow.innerHTML = "";
  ensureActionsPanelVisible(false);
}

function showDrinkMenu() {
  actionsRow.innerHTML = "";
  ensureActionsPanelVisible(true);

  const drinks = [
    { key: "drink-guinness", label: "Pint of Guinness" },
    { key: "drink-jagerbomb", label: "Jägerbomb" }
  ];

  drinks.forEach((drink) => {
    const btn = document.createElement("button");
    btn.className = "action-button";
    btn.dataset.action = drink.key;
    btn.textContent = drink.label;
    actionsRow.appendChild(btn);
  });
}

function playSongById(songId) {
  const song = SONGS_BY_ID[songId];
  if (!song || isGameOver) return;

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

  if (!hasAudio) return;

  const audio = new Audio(song.mp3Url);
  audio.muted = isMuted;
  currentAudio = audio;

  audio.addEventListener("ended", () => {
    if (currentAudio === audio) {
      setSongDetailsVisible(false);
      const msg = getRandomKaraokeEndLogMessage();
      if (msg) appendToLog(msg);
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

function performAction(actionKey, options = {}) {
  if (isGameOver) return;

  const label = options.label || "";

  // Map navigation
  if (actionKey === "go-union-from-map") {
    goToRoom("bar", { initial: true });
    return;
  }

  if (actionKey === "map-closed") {
    const place = label || "That place";
    appendToLog(`${place} is closed tonight.`);
    dialogueText.textContent = "Looks like they are closed.";
    return;
  }

  // Room navigation between Union areas
  if (actionKey === "go-karaoke") {
    goToRoom("karaoke");
    return;
  }

  if (actionKey === "back-to-bar") {
    goToRoom("bar");
    return;
  }

  if (actionKey === "back-to-map") {
    goToRoom("map");
    return;
  }

  // Open song list (karaoke only)
  if (actionKey === "open-song-list" && currentRoom === "karaoke") {
    showSongListOverlay();
    return;
  }

  // Drinks flow
  if (actionKey === "order-drink" && currentRoom === "bar") {
    showDrinkMenu();
    return;
  }

  if (actionKey === "drink-guinness") {
    clearActions();
    drinkCount += 1;
    incrementDrunkness();

    const ref = { value: null };
    const res = getRandomFromArray(GUINNESS_DIALOGUE_OPTIONS, ref);
    dialogueText.textContent = res
      ? res.value
      : "Mags hands you a Guinness.";
    appendToLog("You order a drink, Steve cackles.");

    addDrinkTrophy(FULL_PINT_URL, `Pint of stout #${drinkCount}`);

    spawnDrinkOnBar({
      fullUrl: FULL_PINT_URL,
      emptyUrl: EMPTY_PINT_URL,
      x: 108,
      y: 462
    });

    return;
  }

  if (actionKey === "drink-jagerbomb") {
    clearActions();
    drinkCount += 1;
    incrementDrunkness();

    dialogueText.textContent = "Julie looks on approvingly.";
    appendToLog("You neck a Jägerbomb.");

    addDrinkTrophy(JAEGER_URL, `Jägerbomb #${drinkCount}`);

    spawnDrinkOnBar({
      fullUrl: JAEGER_URL,
      emptyUrl: null,
      x: 108,
      y: 462,
      fullMs: 4000
    });

    return;
  }
}

// -------------------------
// EVENT HANDLERS
// -------------------------

function ensureActionsClickHandler() {
  if (!actionsRow) return;
  actionsRow.addEventListener("click", (event) => {
    const button = event.target.closest(".action-button");
    if (!button) return;
    const key = button.dataset.action;
    if (!key) return;
    performAction(key);
  });
}

// -------------------------
// INIT
// -------------------------

window.addEventListener("DOMContentLoaded", () => {
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
      const hoverText = hotspot.dataset.hoverText || "";
      if (actionKey) {
        performAction(actionKey, { label: hoverText });
      }
    });

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

      // MAP: no text label, but show hover card if known location
      if (currentRoom === "map") {
        if (hoverLabel) hoverLabel.classList.remove("is-visible");

        const hotspot = event.target.closest(".hotspot");
        if (hotspot && hotspot.id && MAP_LOCATION_INFO[hotspot.id]) {
          showLocationCardFor(MAP_LOCATION_INFO[hotspot.id]);
        } else {
          hideLocationCard();
        }
        return;
      }

      // Non-map rooms: standard hover label, no map card
      hideLocationCard();

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
          if (labelTop < 0) labelTop = 0;

          hoverLabel.style.left = `${centerX}px`;
          hoverLabel.style.top = `${labelTop}px`;
        } else {
          hoverLabel.classList.remove("is-visible");
        }
      }
    });

    environmentFrame.addEventListener("mouseleave", () => {
      if (customCursorEl) customCursorEl.style.display = "none";
      clearHoverUI();
      hideLocationCard();
    });
  }

  ensureActionsClickHandler();

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

  if (muteToggleBtn) {
    muteToggleBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      muteToggleBtn.textContent = isMuted ? "🔇 Muted" : "🔊 Sound On";
      if (currentAudio) currentAudio.muted = isMuted;
    });
  }

  if (restartButton) {
    restartButton.addEventListener("click", resetGame);
  }

  if (currentSongId) setCurrentSong(currentSongId);

  // Initial state: MAP
  goToRoom("map", { initial: true });
  appendToLog("You unfold the map of Levenshulme.");
  updateDrunknessDisplay();
  updateTrophyTitle();
  setSongDetailsVisible(false);
});
