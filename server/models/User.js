const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, "Alphanumber Charcters only"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    require: true,
    minlength: 5,
  },
  savedCards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  trades:[
    {
      type: Schema.Types.ObjectId,
      ref: "Trade",
    },
  ]
});

// Middleware to runs before the saving to the database
userSchema.pre("save", async function (next) {
  // this.isNew checks if database isnt created yet or hasnt been added to?
  // this.isModified takes in an argument of the field (in string form) and checks if it has been
  // changed bascially to bcrypt if you update your password
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10; // the amount hash rounds
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next(); //moves on
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
  // adds a method to the usershcma to compare passwords for later use
};

const User = model("User", userSchema);
module.exports = User;
