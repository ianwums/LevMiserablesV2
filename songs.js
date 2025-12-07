// Simple data-only config for karaoke songs.
// Edit this file to add/remove songs or toggle them on/off.

window.KARAOKE_SONGS = [
  {
    id: "morrissey",
    title: "Everyday Is Like Sunday",
    artist: "Morrissey",
    enabled: true, // set to false to hide from UI
    mp3Url:
      "", // e.g. "https://levmiserables.s3.../everyday_is_like_sunday.mp3"
    customDialogue: "" // if non-empty, ONLY this dialogue is shown when selected
  },
  {
    id: "kitchen",
    title: "You'll Always Find Me In The Kitchen At Parties",
    artist: "Jona Lewie",
    enabled: true,
    mp3Url:
      "", // e.g. "https://levmiserables.s3.../kitchen_at_parties.mp3"
    customDialogue: "" // e.g. "The host looks worried. This track isn't ready yet."
  }

  // Example of a disabled / not-yet-available song:
  // {
  //   id: "coming_soon",
  //   title: "Mystery Track",
  //   artist: "Unknown Artist",
  //   enabled: false,
  //   mp3Url: "",
  //   customDialogue:
  //     "The song list flickers. This track hasn't arrived at the bar yet."
  // }
];
