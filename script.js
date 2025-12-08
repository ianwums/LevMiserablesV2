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
const drunknessValueEl = document.getElementById("drunkness-value");
const trophiesTitleEl = document.getElementById("trophies-title");
const muteToggleBtn = document.getElementById("mute-toggle");

// Song list overlay
const songListOverlay = document.getElementById("song-list-overlay");
const songListContainer = document.getElementById("song-list-container");
const songListCloseBtn = document.getElementById("song-list-close");

// Game over overlay
const gameOverOverlay = document.getElementById("game-over-overlay");
const gameOverRestartBtn = document.getElementById("game-over-restart");

// Map location card
const mapLocationCardEl = document.getElementById("map-location-card");
const mapLocationCardTitleEl = document.getElementById(
  "map-location-card-title"
);
const mapLocationCardImageEl = document.getElementById(
  "map-location-card-image"
);
const mapLocationCardPlaceholderEl = document.getElementById(
  "map-location-card-placeholder"
);

// =========================
// IMAGE / AUDIO URLS
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
const JAGER_IMAGE_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/Ja%CC%88gerbombPixel.png";

const POINTER_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/UI_Elements/pointer.gif";

// Map location card icons
const MAP_LOCATION_ICONS = {
  home:
    "https://levmiserables.s3.eu-north-1.amazonaws.com/images/locationicons/homeiconpix.png"
  // others will use placeholder for now
};

// =========================
// SONG DATA (FROM songs.js)
// =========================

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

// =========================
// HOTSPOTS
// =========================

// 50x50 hotspots for bar & karaoke; 22x22 for map.
const HOTSPOTS = {
  bar: [
    {
      id: "bar-order-drink",
      xPercent: (200 - 25) / 8, // centre 200,400 -> top-left 175
      yPercent: ((400 - 25) / 600) * 100,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Order drink",
      actionKey: "open-drink-menu"
    },
    {
      id: "bar-karaoke-room",
      xPercent: (650 - 25) / 8, // centre 650,50 -> top-left 625
      yPercent: ((50 - 25) / 600) * 100,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Karaoke Room",
      actionKey: "go-karaoke"
    }
  ],
  karaoke: [
    {
      id: "karaoke-back-bar",
      xPercent: (75 - 25) / 8, // centre 75,50
      yPercent: ((50 - 25) / 600) * 100,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Back to bar",
      actionKey: "back-to-bar"
    },
    {
      id: "karaoke-pick-song",
      xPercent: ((647 - 25) / 800) * 100, // centre 647,514
      yPercent: ((514 - 25) / 600) * 100,
      widthPercent: (50 / 800) * 100,
      heightPercent: (50 / 600) * 100,
      hoverText: "Pick a song",
      actionKey: "open-song-list"
    }
  ],
  map: [] // filled from MAP_LOCATIONS below
};

// Map locations (centres in 800x600 space)
const MAP_LOCATIONS = [
  { id: "levenshulme_bakery", name: "Levenshulme Bakery", x: 147, y: 17 },
  { id: "overdraught", name: "OverDraught", x: 192, y: 328 },
  { id: "trawlers_2", name: "Trawlers 2", x: 688, y: 163 },
  { id: "long_bois", name: "Long Boi's", x: 15, y: 442 },
  { id: "station_hop", name: "Station Hop", x: 160, y: 208 },
  { id: "new_york_krispy", name: "New York Krispy", x: 196, y: 266 },
  { id: "union_inn", name: "The Union Inn", x: 196, y: 298 },
  { id: "tesco", name: "Tesco Superstore", x: 208, y: 430 },
  { id: "atm", name: "ATM", x: 222, y: 457 },
  { id: "the_levenshulme", name: "The Levenshulme", x: 258, y: 504 },
  { id: "talleyrand", name: "The Talleyrand", x: 244, y: 524 },
  { id: "isca", name: "Isca", x: 258, y: 552 },
  {
    id: "levenshulme_antiques",
    name: "Levenshulme Antiques Village",
    x: 278,
    y: 539
  },
  { id: "nordie", name: "Nordie", x: 264, y: 578 },
  { id: "station_south", name: "Station South", x: 299, y: 581 },
  { id: "home", name: "Home", x: 59, y: 384 },
  { id: "blue_bell", name: "The Blue Bell Inn", x: 525, y: 225 }
];

// build map hotspots (22x22)
MAP_LOCATIONS.forEach((loc) => {
  const left = loc.x - 11;
  const top = loc.y - 11;
  HOTSPOTS.map.push({
    id: `map-${loc.id}`,
    xPercent: (left / 800) * 100,
    yPercent: (top / 600) * 100,
    widthPercent: (22 / 800) * 100,
    heightPercent: (22 / 600) * 100,
    hoverText: "", // map uses cards, no text label
    actionKey: "map-location",
    locationId: loc.id
  });
});

const MAP_LOCATIONS_BY_ID = {};
MAP_LOCATIONS.forEach((loc) => (MAP_LOCATIONS_BY_ID[loc.id] = loc));

// =========================
// STATE
// =========================

let currentRoom = "map"; // "map" | "bar" | "karaoke"
let currentSongId = SONG_LIST.length ? SONG_LIST[0].id : null;
let drinkCount = 0;
let trophyCount = 0;
let drunkness = 0;
let currentAudio = null;
let customCursorEl = null;
let isMuted = false;

let currentMapHoverLocationId = null;

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
  drunknessValueEl.textContent = drunkness;
}

function updateTrophiesDisplay() {
  trophiesTitleEl.textContent = `TROPHIES: ${trophyCount}`;
}

function addTrophy(imgUrl, altText) {
  trophyCount += 1;
  updateTrophiesDisplay();

  const slot = document.createElement("div");
  slot.className = "drink-slot";

  const img = document.createElement("img");
  img.className = "drink-image";
  img.src = imgUrl;
  img.alt = altText;

  slot.appendChild(img);
  iconRow.appendChild(slot);
}

function incrementDrunkness() {
  drunkness += 1;
  updateDrunknessDisplay();

  if (drunkness >= 10) {
    showGameOverOverlay();
  }
}

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

function clearHoverUI() {
  if (hoverLabel) hoverLabel.classList.remove("is-visible");
}

function hideMapLocationCard() {
  currentMapHoverLocationId = null;
  if (mapLocationCardEl) {
    mapLocationCardEl.classList.remove("is-visible");
  }
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
    if (h.hoverText) el.dataset.hoverText = h.hoverText;
    if (h.locationId) el.dataset.locationId = h.locationId;

    el.style.left = `${h.xPercent}%`;
    el.style.top = `${h.yPercent}%`;
    el.style.width = `${h.widthPercent}%`;
    el.style.height = `${h.heightPercent}%`;

    environmentFrame.appendChild(el);
  });

  // map-specific visual mode
  if (roomId === "map") {
    environmentFrame.classList.add("map-mode");
  } else {
    environmentFrame.classList.remove("map-mode");
  }
}

// =========================
// ROOMS
// =========================

function goToRoom(room, options = {}) {
  const { initial = false } = options;
  currentRoom = room;

  clearHoverUI();
  hideMapLocationCard();
  stopCurrentAudio();
  setSongDetailsVisible(false);
  hideSongListOverlay();

  if (room === "map") {
    locationNameEl.textContent = "Map";
    environmentBaseImg.src = MAP_IMAGE;

    if (!initial) {
      appendToLog("You unfold the map of Levenshulme.");
    }

    dialogueText.textContent = "Where will you start tonight?";
  } else if (room === "bar") {
    locationNameEl.textContent = "THE UNION - BAR AREA";
    environmentBaseImg.src = BAR_IMAGE;

    if (!initial) {
      appendToLog("To the bar!");
    }

    dialogueText.textContent =
      "Mags and Steve are behind the bar. It's going to be a good night.";
  } else if (room === "karaoke") {
    locationNameEl.textContent = "THE UNION - KARAOKE ROOM";
    environmentBaseImg.src = KARAOKE_ROOM_IMAGE;

    appendToLog(
      "The baying mob approach Ronnie, song slips in hand."
    );
    dialogueText.textContent =
      "A small crowd hovers near the screen, waiting for their turn to murder a classic.";
  }

  renderActions();
  renderHotspotsForRoom(room);
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
// ACTIONS
// =========================

const GUINNESS_DIALOGUE_OPTIONS = [
  "Mags hands you a Guinness topped with a Musical Note",
  "Mags hands you a Guinness topped with a Shamrock",
  "Mags hands you a Guinness topped with a Heart",
  "Mags hands you a Guinness topped with MUFC"
];

function getRandomGuinnessDialogue() {
  const idx = Math.floor(Math.random() * GUINNESS_DIALOGUE_OPTIONS.length);
  return GUINNESS_DIALOGUE_OPTIONS[idx];
}

function getActionsForRoom() {
  if (currentRoom === "bar") {
    // No fixed actions – drink menu appears only when opened.
    return [];
  }

  if (currentRoom === "karaoke") {
    return [
      { key: "open-song-list", label: "Song list" },
      { key: "back-to-bar", label: "Go back to bar" }
    ];
  }

  // map: no actions
  return [];
}

function renderActions() {
  const actions = getActionsForRoom();
  actionsRow.innerHTML = "";

  if (!actions.length) {
    actionsPanel.classList.remove("has-actions");
    return;
  }

  actionsPanel.classList.add("has-actions");

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "action-button";
    button.dataset.action = action.key;
    button.textContent = action.label;
    actionsRow.appendChild(button);
  });
}

function showDrinkMenu() {
  // Drink menu replaces actions row contents but keeps panel visible
  actionsRow.innerHTML = "";

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

  actionsPanel.classList.add("has-actions");
}

// =========================
// DRINK SPAWN EFFECT
// =========================

function spawnDrinkEffect(type) {
  if (!environmentFrame) return;

  const img = document.createElement("img");
  img.className = "spawned-drink";
  img.style.opacity = "0";

  // Spawn position in image coordinates
  let spawnX = 108;
  let spawnY = 462;

  let fullUrl = FULL_PINT_URL;
  let emptyUrl = EMPTY_PINT_URL;

  if (type === "jager") {
    fullUrl = JAGER_IMAGE_URL;
    emptyUrl = ""; // no empty version
    spawnX = 150;
    spawnY = 460;
  }

  img.src = fullUrl;

  const leftPercent = (spawnX / 800) * 100;
  const topPercent = (spawnY / 600) * 100;

  img.style.left = `${leftPercent}%`;
  img.style.top = `${topPercent}%`;

  environmentFrame.appendChild(img);

  // Fade in full, then fade out and (for Guinness) swap to empty before disappearing.
  requestAnimationFrame(() => {
    img.classList.add("drink-fade-in");
  });

  setTimeout(() => {
    if (emptyUrl) {
      img.src = emptyUrl;
    }
    img.classList.remove("drink-fade-in");
    img.classList.add("drink-fade-out");
  }, 3000);

  setTimeout(() => {
    img.remove();
  }, 6000);
}

// =========================
// KARAOKE PLAYBACK
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
        if (endMsg) appendToLog(endMsg);
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
// ACTION DISPATCH
// =========================

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
  if (actionKey === "open-drink-menu" && currentRoom === "bar") {
    showDrinkMenu();
    return;
  }

  // Drink selections
  if (actionKey === "drink-guinness") {
    const line = getRandomGuinnessDialogue();
    appendToLog("You order a drink, Steve cackles.");
    dialogueText.textContent = line;

    addTrophy(FULL_PINT_URL, "Pint of Guinness");
    incrementDrunkness();
    spawnDrinkEffect("guinness");
    return;
  }

  if (actionKey === "drink-jagerbomb") {
    appendToLog("You order a Jägerbomb.");
    dialogueText.textContent = "Julie looks on approvingly";

    addTrophy(JAGER_IMAGE_URL, "Jägerbomb");
    incrementDrunkness();
    spawnDrinkEffect("jager");
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
// MAP LOGIC
// =========================

function handleMapLocationClick(locationId) {
  const loc = MAP_LOCATIONS_BY_ID[locationId];
  if (!loc) return;

  if (locationId === "union_inn") {
    goToRoom("bar");
    return;
  }

  appendToLog(`You check ${loc.name}, but it looks closed.`);
  dialogueText.textContent = "Looks like they are closed.";
}

// Show map card near hotspot, clamped 75px from edges
const MAP_CARD_MARGIN = 75;

function showMapLocationCard(locationId, hotspotEl) {
  if (!mapLocationCardEl || !environmentFrame) return;
  if (!locationId) return;

  currentMapHoverLocationId = locationId;

  const loc = MAP_LOCATIONS_BY_ID[locationId];
  if (!loc) return;

  // Update title
  mapLocationCardTitleEl.textContent = loc.name;

  // Image vs placeholder
  const iconUrl = MAP_LOCATION_ICONS[locationId] || "";
  if (iconUrl) {
    mapLocationCardImageEl.src = iconUrl;
    mapLocationCardImageEl.style.display = "block";
    mapLocationCardPlaceholderEl.style.display = "none";
  } else {
    mapLocationCardImageEl.style.display = "none";
    mapLocationCardPlaceholderEl.style.display = "flex";
  }

  mapLocationCardEl.classList.add("is-visible");

  const frameRect = environmentFrame.getBoundingClientRect();
  const hotRect = hotspotEl.getBoundingClientRect();

  // Temporarily let the browser calculate card size
  const cardRect = mapLocationCardEl.getBoundingClientRect();

  const hotCenterX = hotRect.left + hotRect.width / 2;
  const hotCenterY = hotRect.top + hotRect.height / 2;

  // Start to the right of hotspot
  let left = hotRect.right - frameRect.left + 16;
  let top = hotCenterY - frameRect.top - cardRect.height / 2;

  const maxLeft = frameRect.width - cardRect.width - MAP_CARD_MARGIN;
  const maxTop = frameRect.height - cardRect.height - MAP_CARD_MARGIN;

  left = Math.max(MAP_CARD_MARGIN, Math.min(left, maxLeft));
  top = Math.max(MAP_CARD_MARGIN, Math.min(top, maxTop));

  mapLocationCardEl.style.left = `${left}px`;
  mapLocationCardEl.style.top = `${top}px`;
}

// =========================
// GAME OVER
// =========================

function showGameOverOverlay() {
  if (!gameOverOverlay) return;
  gameOverOverlay.classList.add("is-visible");
}

function hideGameOverOverlay() {
  if (!gameOverOverlay) return;
  gameOverOverlay.classList.remove("is-visible");
}

// Reset basic game state
function resetGameState() {
  drunkness = 0;
  drinkCount = 0;
  trophyCount = 0;
  updateDrunknessDisplay();
  updateTrophiesDisplay();

  iconRow.innerHTML = "";
  actionLog.innerHTML = "";
  appendToLog("You unfold the map of Levenshulme.");
  dialogueText.textContent = "Where will you start tonight?";

  stopCurrentAudio();
  hideSongListOverlay();
  setSongDetailsVisible(false);

  goToRoom("map", { initial: true });
}

// =========================
// MUTE TOGGLE
// =========================

function updateMuteButtonLabel() {
  muteToggleBtn.textContent = isMuted ? "🔇 Muted" : "🔊 Sound On";
}

function toggleMute() {
  isMuted = !isMuted;
  updateMuteButtonLabel();

  if (currentAudio) {
    currentAudio.muted = isMuted;
  }
}

// =========================
// INIT
// =========================

window.addEventListener("DOMContentLoaded", () => {
  actionsRow.addEventListener("click", handleActionClick);

  if (muteToggleBtn) {
    muteToggleBtn.addEventListener("click", toggleMute);
    updateMuteButtonLabel();
  }

  if (gameOverRestartBtn) {
    gameOverRestartBtn.addEventListener("click", () => {
      hideGameOverOverlay();
      resetGameState();
    });
  }

  // Custom cursor + hotspot behaviour
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

      if (currentRoom === "map" && hotspot.dataset.locationId) {
        handleMapLocationClick(hotspot.dataset.locationId);
        return;
      }

      const actionKey = hotspot.dataset.actionKey;
      if (actionKey) performAction(actionKey);
    });

    // Mouse move: cursor + hover label / map card
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

      const hotspot = event.target.closest(".hotspot");

      if (currentRoom === "map") {
        clearHoverUI();

        if (hotspot && hotspot.dataset.locationId) {
          showMapLocationCard(hotspot.dataset.locationId, hotspot);
        } else {
          hideMapLocationCard();
        }

        return;
      }

      // Non-map rooms: no map card
      hideMapLocationCard();

      if (hoverLabel) {
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
      hideMapLocationCard();
    });
  }

  // Song list selection
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

  if (currentSongId) setCurrentSong(currentSongId);

  // Initial setup: already seeded log entry in HTML
  updateDrunknessDisplay();
  updateTrophiesDisplay();

  goToRoom("map", { initial: true });
  setSongDetailsVisible(false);
});
