const { Schema, model } = require("mongoose");

const tradeSchema = new Schema({
  trader: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  offeredCard: [

    {

      type: Schema.Types.ObjectId,

      ref: "Card",


    },

  ],

  requestedCard: [

    {

      type: Schema.Types.ObjectId,

      ref: "Card",


    },

  ],

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"], // only allow these values to be added
    default: "pending", // default value
  },
});
const Trade = model("Trade", tradeSchema);
module.exports = Trade;

// create a method that checks if the requestedf and offerend card belongs to the right user
// should add a created a field so that if after a certain time and the trade is still pending it is delete it automatically