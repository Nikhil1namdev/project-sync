import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  // projectId: { type: mongoose.Schema.Types.ObjectId, ref: "CreatingProject", required: true },
  Types: { type: String },
  Key: { type: String },
  Summary: { type: String },
  Status: { type: String },
  comment: { type: String },
  Assignee: { type: String, default: "Devansh Jain" },
  Priority: { type: String },
  Created: { type: Date, default: Date.now },
  Updated: { type: String },
  Reporter: { type: String },
});

const TableModel = mongoose.model("TableModel", TableSchema);
export default TableModel;
