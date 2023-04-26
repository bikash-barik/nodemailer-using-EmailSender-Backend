import mongoose from "mongoose";
// Logo Model
const LogoSchema = new mongoose.Schema({
  sl_no: { type: Number },
  logo_title: { type: String },
  photo: { type: String },
  publish_status: { type: String, default: "unset" },
  timestamp: { type: Date, default: Date.now },
});
const Logo = mongoose.model("Logo", LogoSchema);
export default Logo;
