import { uploadeFiles } from "../helper/uploadeFIleToCloudinary.js";
import Album from "../models/Album.js";
import Room from "../models/Room.js";
import Song from "../models/Song.js";
import User from "../models/User.js";

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.audioFile) {
      return res
        .status(400)
        .json({ status: false, message: "Please uploade  audio files" });
    }

    const { title, artist, albumId, releaseYear, duration } = req.body;
    const imageFile = req.files.imageFile;
    const audioFile = req.files.audioFile;

    // uploade image & audio file here

    const imageUrl = await uploadeFiles(imageFile);
    const audioUrl = await uploadeFiles(audioFile);

    const song = await Song.create({
      title,
      artist,
      imageUrl,
      audioUrl,
      releaseYear,
      duration,
      album: albumId || null,
    });

    // if song has an albumId update the album
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: {
          songs: song._id,
        },
      });
    }
  } catch (error) {
    console.log("Error in create song controller");
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ status: false, message: "Song not found" });
    }

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in delete song controller");
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    let imageUrl = null;

    if (imageFile) {
      imageUrl = await uploadeFiles(imageFile);
    }

    const album = await Album.create({
      title,
      artist,
      imageUrl,
      releaseYear,
    });
    res.status(201).json({ status: true, album });
  } catch (error) {
    console.log("Error in create album controller");
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Song.deleteMany({ album: id });
    await Album.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in delete album controller");
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const currentUser = req.auth.userId;
    const user = await User.findOne({
      clerkId: currentUser,
    });

    if (user.role !== "admin") {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized! User is not admin" });
    }
    res.status(200).json({ status: true, admin: true });
  } catch (error) {
    console.log("Error in check Admin controller", error.message);
    next(error);
  }
};

export const acceptJoinRequest = async (req, res, next) => {
  try {
    const { roomId, userId } = req.body;
    if (!roomId || !userId)
      return res
        .status(401)
        .json({ status: false, message: "Please provide roomId and userId" });

    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({
        status: false,
        message: "No room is available with this roomid",
      });

    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ status: false, message: "Only room admin can do that" });

    if (room.participants.includes(userId)) {
      return res.status(401).json({
        status: false,
        message: "User is already a member of this group",
      });
    }

    room.participants.push(userId);
    const otherUser = await User.findById(userId);
    if (otherUser) {
      otherUser.rooms.push(roomId);
    }
    Promise.all([room.save(), otherUser.save()]);
  } catch (error) {
    console.log("Error in accept request controller");
    next(error);
  }
};
export const rejectJoinRequest = async (req, res, next) => {
  try {
    const { roomId, userId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room)
      return res.status(404).json({ status: false, message: "No room found " });

    if (room.participants.includes(userId))
      return res.status(400).json({
        status: false,
        message: "User is already a member of this room",
      });

    room.requests.pull(userId);

    await room.save();
    res.status(200).json({ status: true, message: "Request rejected" });
  } catch (error) {
    console.log("Error in rejectJoinRequest admin controller", error.message);
    next(error);
  }
};
