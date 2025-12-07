// Data-only config for karaoke songs.
// Edit this file to add/remove songs or toggle them on/off.

window.KARAOKE_SONGS = [
  {
    id: "morrissey",
    title: "Everyday Is Like Sunday",
    artist: "Morrissey",
    enabled: false, // set to false to hide from UI
    mp3Url: "", // e.g. "https://levmiserables.s3.../everyday_is_like_sunday.mp3"

    // If populated, selecting this song will show ONLY this dialogue
    // and will not change the overlay or play audio.
    customDialogue: "",

    // Dialogue that appears in the dialogue panel when the song is selected
    // (normal play behaviour).
    selectDialogue:
      "The intro crackles through the speakers as the screen flashes MORRISSEY."
  },
  {
    id: "kitchen",
    title: "You'll Always Find Me In The Kitchen At Parties",
    artist: "Jona Lewie",
    enabled: true,
    mp3Url: "", // e.g. "https://levmiserables.s3.../kitchen_at_parties.mp3"
    customDialogue:
      "Ronnie informs you he doesn't have that song. You are, as always, crestfallen.",

    selectDialogue:
      "The crowd murmurs appreciatively as the familiar synth line kicks in."
  },
  {
    id: "blackstar",
    title: "Blackstar",
    artist: "David Bowie",
    enabled: true,
    mp3Url:
      "https://levmiserables.s3.eu-north-1.amazonaws.com/audio/karaoke_blackstar.mp3",
    customDialogue: "",
    selectDialogue: "It's going to be a long and morbid night."
  },
  {
    id: "gfinac",
    title: "Girlfriend in a Coma",
    artist: "The Smiths",
    enabled: true,
    mp3Url:
      "https://levmiserables.s3.eu-north-1.amazonaws.com/audio/karaoke_girlfriend_in_a_coma.mp3",
    customDialogue: "",
    selectDialogue:
      "Whisper your last goodbyes, you probably won't get another shot afer this."
  },
  {
    id: "rockdj",
    title: "Rock DJ",
    artist: "Robbie Williams",
    enabled: true,
    mp3Url:
      "https://levmiserables.s3.eu-north-1.amazonaws.com/audio/karaoke_rock_dj.mp3",
    customDialogue: "",
    selectDialogue: "Who are you calling a Fat Dancer?"
  },
  {
    id: "underpressure",
    title: "Under Pressure",
    artist: "Queen, David Bowie",
    enabled: true,
    mp3Url:
      "https://levmiserables.s3.eu-north-1.amazonaws.com/audio/karaoke_under_pressure.mp3",
    customDialogue: "",
    selectDialogue: "Hope you brought a friend."
  },
  {
    id: "didntstartfire",
    title: "We Didn't Start the Fire",
    artist: "Billy Joel",
    enabled: true,
    mp3Url:
      "https://levmiserables.s3.eu-north-1.amazonaws.com/audio/karaoke_we_didnt_start_the_fire.mp3",
    customDialogue: "",
    selectDialogue:
      "You probably don't even need the screen for this one."
  },
  {
    id: "rollercoaster",
    title: "Life is a Rollercoaster",
    artist: "Ronan Keating",
    enabled: true,
    mp3Url:
      "https://levmiserables.s3.eu-north-1.amazonaws.com/audio/karaoke_rollercoaster.mp3",
    customDialogue: "",
    selectDialogue: "Now THAT is a PROPER song."
  }
];
