const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const authorsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      unique: true,
    },
    DOB: {
      type: Date,
    },
    about: {
      type: String,
      required: [true, "Please enter some information about you"],
    },
    img: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaZ_OQlwea8y2F2UvhKMi0DwpNSQLmAkqZ5OaANeCvYtCcMx36_FYABc177om5i8-tnIE&usqp=CAU",
    },
    views: {
      type: Number,
      default: 0, // Starts at 0 when a new document is created
    },
  },
  { timestamps: true } //
);
module.exports = mongoose.model("author", authorsSchema);
