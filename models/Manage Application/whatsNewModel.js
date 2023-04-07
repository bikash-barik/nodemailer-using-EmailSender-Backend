import mongoose from "mongoose";
// WhatsNew Model
const WhatsNewSchema = new mongoose.Schema({
  sl_no: { type: Number },
  headline: { type: String },
  description: { type: String },
  document: { type: String },
  publish_status: { type: String, default: "unset" },
  timestamp: { type: Date, default: Date.now },
});
const WhatsNew = mongoose.model("WhatsNew", WhatsNewSchema);
export default WhatsNew;
