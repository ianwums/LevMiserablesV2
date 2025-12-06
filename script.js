const actionLog = document.getElementById("action-log");
const dialogueText = document.getElementById("dialogue-text");
const environmentImage = document.getElementById("environment-image");

const actionEffects = {
  "order-drink": {
    log: "You order a drink. The bartender eyes you carefully.",
    dialogue:
      '"What\'s your poison?" the bartender asks, polishing a glass that has seen better decades.',
    // environment: "https://your-s3-bucket/pub-room-bar-closeup.jpg"
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

function handleActionClick(event) {
  const button = event.target.closest(".action-button");
  if (!button) return;

  const actionKey = button.dataset.action;
  const effect = actionEffects[actionKey];
  if (!effect) return;

  appendToLog(effect.log);
  dialogueText.textContent = effect.dialogue;

  // If we later want to change the environment image:
  // if (effect.environment) {
  //   environmentImage.src = effect.environment;
  // }
}

document
  .querySelector(".actions-row")
  .addEventListener("click", handleActionClick);
