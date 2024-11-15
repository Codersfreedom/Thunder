import mongoose from "mongoose";

const albumSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    releaseYear: {
      type: Number,
    },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;
