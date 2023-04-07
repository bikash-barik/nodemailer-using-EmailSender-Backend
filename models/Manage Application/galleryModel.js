

import mongoose from "mongoose";

const gallerySchema = mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
    },
    category:{
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
      default:
        "",
    },
    status:{
       type:Boolean,
       default: 0,
    },
   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
