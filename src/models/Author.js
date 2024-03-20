import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    unique: true,
  },
  born: { type: Number },
});

schema.plugin(mongooseUniqueValidator);

export default mongoose.model("Author", schema);
