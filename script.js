const actionLog = document.getElementById("action-log");
const dialogueText = document.getElementById("dialogue-text");
const environmentImage = document.getElementById("environment-image");
const iconRow = document.getElementById("icon-row");

const FULL_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_full.gif";
const EMPTY_PINT_URL =
  "https://levmiserables.s3.eu-north-1.amazonaws.com/images/guinesspint_empty.gif";

let drinkCount = 0;

const actionEffects = {
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
      "The back room is cluttered with forgotten chairs, a dusty dartboard, and the faint outline of a trapdoor in the floorboards."
  },
  wait: {
    log: "You wait. The pub creaks and murmurs around you.",
    dialogue:
      "Time passes, and with it the noise of the front bar swells and ebbs like a tired tide."
  }
};

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

function handleActionClick(event) {
  const button = event.target.closest(".action-button");
  if (!button) return;

  const actionKey = button.dataset.action;
  const effect = actionEffects[actionKey];
  if (!effect) return;

  appendToLog(effect.log);
  dialogueText.textContent = effect.dialogue;

  if (actionKey === "order-drink") {
    addDrinkIcon();
  }

  // Later we can change environment images per action if we like:
  // if (effect.environment) environmentImage.src = effect.environment;
}

document
  .querySelector(".actions-row")
  .addEventListener("click", handleActionClick);
