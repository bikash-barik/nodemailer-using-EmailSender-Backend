import mongoose from "mongoose";

const TenderSchema = new mongoose.Schema({
  tender_no: {
    type: String,
    required: true,
  },
  tender_headline: {
    type: String,
    required: true,
  },
  closing_date: {
    type: Date,
    required: true,
  },
  closing_time: {
    type: String,
    required: true,
  },
  opening_date: {
    type: Date,
    required: true,
  },
  opening_time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  document_one: {
    type: String,
    required: true,
  },
  document_two: {
    type: String,
    required: true,
  },
  document_three: {
    type: String,
    required: true,
  },
  publish_status: { type: String, default: "unset" },
});

const Tender =  mongoose.model("Tender", TenderSchema);

export default Tender;