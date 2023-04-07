import mongoose from "mongoose";

const newsUpdateSchema = mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
    },
    expiryDate:{
      type: Date,
      required: true,
    },
    uploadDocument: {
      type: String,
      required: true,
      default:
        "",
    },
    description: {
      type: String,
      required: true,
    },
    status:{
       type:Boolean,
       required: true,
       default: true,
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

const NewsUpdate = mongoose.model("NewsUpdate", newsUpdateSchema);

export default NewsUpdate;
