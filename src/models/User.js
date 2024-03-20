import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    unique: true,
  },
  favoriteGenre: {
    type: String,
  },
});

schema.plugin(mongooseUniqueValidator);

export default mongoose.model("User", schema);
