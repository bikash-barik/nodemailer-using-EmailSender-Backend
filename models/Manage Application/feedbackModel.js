import mongoose from "mongoose";
// Feedback Model
const FeedbackSchema = new mongoose.Schema({
  sl_no: { type: Number },
  name: { type: String },
  email: { type: String },
  timestamp: { type: Date, default: Date.now },
});
const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
