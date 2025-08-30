const Music = require('../models/music.model');


const createMusic = async (data) => {
    try {
        const music = new Music(data);
        return await music.save();
    } catch (error) {
        throw new Error("Error creating music", error.message);
    }
};

const getAllMusic = async (userId) => {
    try {
         return await Music.find({
            $or: [
                { userId: null },
                { userId: userId }
            ]
        });
    } catch (error) {
        throw new Error("Error fetching music : ", error.message);
    }
};



module.exports = {
    createMusic,
    getAllMusic
};