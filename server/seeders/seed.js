const db = require("../config/connection");
const { User, Card, Trade } = require("../models/index");
const cardSeeds = require("./cardSeeds.json");
const userSeeds = require("./userSeeds.json");
const cleanDb = require("./cleanDb");

db.once("open", async () => {
  try {
    await cleanDb("Card", "cards");
    await cleanDb("User", "users");
    await cleanDb("Trade", "trades");

    const users = await User.create(userSeeds);
    const cards = await Card.create(cardSeeds);

    if (users.length > 0 && cards.length > 0) {
      // Select 5 random cards
      const cardsOwned = [];
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        cardsOwned.push(cards[randomIndex]._id);
      }

      const cardsOwned2 = [];
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        cardsOwned2.push(cards[randomIndex]._id);
      }

      // Push random cardsOwned array to the savedCards of user[0]
      users[0].savedCards.push(...cardsOwned);
      users[1].savedCards.push(...cardsOwned2);

      // Save the updated user
      await users[0].save();
      await users[1].save();
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  console.log("Database Seeded");
  process.exit(0);
});
