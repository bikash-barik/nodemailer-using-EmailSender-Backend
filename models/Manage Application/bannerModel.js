import mongoose from "mongoose";
// Banner Model
const BannerSchema = new mongoose.Schema({
  sl_no: { type: Number },
  caption: { type: String },
  banner: { type: String },
  publish_status: { type: String, default: "unset" },
  timestamp: { type: Date, default: Date.now },
});
const Banner = mongoose.model("Banner", BannerSchema);
export default Banner;
