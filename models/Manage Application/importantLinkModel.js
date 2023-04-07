import mongoose from "mongoose";

const importantLinkSchema = mongoose.Schema(
  {
    importantLinkdata: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
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

const ImportantLink = mongoose.model("ImportantLink", importantLinkSchema);

export default ImportantLink;
