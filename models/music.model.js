const mongoose = require("mongoose");

const MusicSchema = new mongoose.Schema({
  backgroundMusicName: {
    type: String,
    required: true,
  },
  backgroundMusic: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Music = mongoose.model("Music", MusicSchema);
module.exports = Music;
