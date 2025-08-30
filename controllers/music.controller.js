const musicService = require("../services/music.service");
const { uploadFile } = require("../utils/upload");

const createMusic = async (req, res) => {
    try {
        const userId = req.user._id;
        const { backgroundMusicName } = req.body;
        const { files } = req;


        if (!files.backgroundMusic) {
            return res.status(400).json({ success: false, message: "Music file is required" });
        }

        const cloudinaryResult = await uploadFile(files.backgroundMusic, "music", "audio");

        const musicData = {
            backgroundMusicName,
            backgroundMusic: cloudinaryResult.secure_url,
            userId,
        };

        const music = await musicService.createMusic(musicData);
        res.status(201).json({ success: true, message: "Music uploaded successfully", data: music });

    } catch (error) {
        console.error("Error creating music:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllMusic = async (req, res) => {
    try {
        const userId = req.user._id;
        const musicList = await musicService.getAllMusic(userId);
        res.status(200).json({ success: true, data: musicList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createMusic,
    getAllMusic
};