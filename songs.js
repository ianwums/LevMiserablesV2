// Data-only config for karaoke songs.
// Edit this file to add/remove songs or toggle them on/off.

window.KARAOKE_SONGS = [
  {
    id: "morrissey",
    title: "Everyday Is Like Sunday",
    artist: "Morrissey",
    enabled: true, // set to false to hide from UI
    mp3Url:
      "", // e.g. "https://levmiserables.s3.../everyday_is_like_sunday.mp3"

    // If populated, selecting this song will show ONLY this dialogue
    // and will not change the overlay or play audio.
    customDialogue: "",

    // Dialogue that appears in the dialogue panel when the song is selected
    // (normal play behaviour).
    selectDialogue:
      "Unlike Stephen Patrick Morrissey, you do not let your public down.",

    // Dialogue that appears when the player toggles "Show song details"
    // while this song is the current one.
    detailsDialogue:
      "The screen announces: EVERYDAY IS LIKE SUNDAY – MORRISSEY."
  },
  {
    id: "kitchen",
    title: "You'll Always Find Me In The Kitchen At Parties",
    artist: "Jona Lewie",
    enabled: true,
    mp3Url:
      "", // e.g. "https://levmiserables.s3.../kitchen_at_parties.mp3"
    customDialogue: "",

    selectDialogue:
      "The crowd murmurs appreciatively as the familiar synth line kicks in.",

    detailsDialogue:
      "The screen announces: YOU'LL ALWAYS FIND ME IN THE KITCHEN AT PARTIES – JONA LEWIE."
  }

  // Example of a disabled / not-yet-available song:
  // {
  //   id: "coming_soon",
  //   title: "Mystery Track",
  //   artist: "Unknown Artist",
  //   enabled: false,
  //   mp3Url: "",
  //   customDialogue:
  //     "The song list flickers. This track hasn't arrived at the bar yet.",
  //   selectDialogue: "",
  //   detailsDialogue: ""
  // }
];
