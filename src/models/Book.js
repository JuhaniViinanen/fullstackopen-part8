import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  published: { type: Number },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [{ type: String }],
});

schema.plugin(mongooseUniqueValidator);

export default mongoose.model("Book", schema);
