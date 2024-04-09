const { User, Card, Trade } = require("../models/index");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find({})
        //  https://dev.to/paras594/how-to-use-populate-in-mongoose-node-js-mo0
        .populate("savedCards")
        .populate({
          path: "trades",
          populate: {
            path: "offeredCard requestedCard trader recipient",
          },
        });
      return users;
    },
    user: async (parent, { username }) => {
      const user = await User.findOne({ username })
        .populate("savedCards")
        .populate({
          path: "trades",
          populate: {
            path: "offeredCard requestedCard trader recipient",
          },
        });
      return user;
    },
    cards: async () => {
      return await Card.find({});
    },
    card: async (parent, { card_id }) => {
      return await Card.findOne({ card_id: card_id });
    },
    // this query is going to be used to get the 3 random cards for opening a pack.
    cardPack: async () => {
      const cards = await Card.aggregate([{ $sample: { size: 3 } }]);
      return cards;
    },
    rareCardPack: async () => {
      // Define probabilities for each rarity level
      const probabilities = {
        common: 0.4,
        uncommon: 0.3,
        rare: 0.2,
        legendary: 0.1,
      };

      // Function to determine rarity level
      const determineRarity = () => {
        const rand = Math.random();
        if (rand < probabilities.legendary) {
          return "legendary";
        } else if (rand < probabilities.legendary + probabilities.rare) {
          return "rare";
        } else if (
          rand <
          probabilities.legendary + probabilities.rare + probabilities.uncommon
        ) {
          return "uncommon";
        } else {
          return "common";
        }
      };

      // Draw 3 cards individually
      const cards = [];
      for (let i = 0; i < 3; i++) {
        const rarity = determineRarity();
        const card = await Card.aggregate([
          { $match: { rarity: rarity } },
          { $sample: { size: 1 } },
        ]);
        cards.push(card[0]);
      }

      return cards;
    },
    // sets up route to allow user to access there profile with saved cards
    me: async (parent, args, context) => {
      console.log(context);
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedCards");
      }
      throw AuthenticationError;
    },
    trades: async () => {
      return await Trade.find({})
        .populate("trader")
        .populate("recipient")
        .populate("offeredCard")
        .populate("requestedCard");
    },
        compareCards:async(parent,{logged,username},context)=>{
      /* meant to do two things compare :
      1)the logged in user with another user
      2) logged in user with the database
        if the username parameter is provided it will compare with another user
        else if the username parameter is falsy the comparison with be between all the cards (the database)
      */
       const loggedInUser=await User.findOne({username:logged }).populate("savedCards");
     const loggedInUserCards=loggedInUser.savedCards.map(card=>card.card_id)
        if(username){
          const searchedUser=await User.findOne({username}).populate("savedCards")
          const searchedUserCards=searchedUser.savedCards.map(card=>card.card_id)
          const filteredCardIds=searchedUserCards.filter(cardId=>!loggedInUserCards.includes(cardId))
          return Card.find({card_id:{$in:filteredCardIds}})
        }
        else{
  const allCards = await Card.find({});
  const allCardIds = allCards.map(card => card.card_id);
  const filteredCardIds = allCardIds.filter(cardId => !loggedInUserCards.includes(cardId));
  return Card.find({ card_id: { $in: filteredCardIds } });
        }
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        console.log("no user found");
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);

      return { token, user };
    },
    addCardsToUser: async (parent, { username, card_ids }) => {
      const newCards = await Card.find({ card_id: { $in: card_ids } });
      const newCardIds = newCards.map((card) => card._id);
      return await User.findOneAndUpdate(
        { username },
        { $addToSet: { savedCards: { $each: newCardIds } } },
        { new: true }
      ).populate("savedCards");
    },

    removeCardFromUser: async (parent, { username, card_id }) => {
      const savedCard = await Card.findOne({ card_id: card_id });
      return await User.findOneAndUpdate(
        { username },
        { $pull: { savedCards: savedCard._id } }
      ).populate("savedCards");
    },

    removeUser: async (parent, { username }) => {
      return await User.findOneAndDelete({ username });
    },
    addCard: async (parent, { card_id, name, rarity, description }) => {
      return await Card.create({
        card_id,
        name,
        rarity,
        description,
      });
    },
    removeCard: async (parent, { card_id }) => {
      return await Card.findOneAndDelete({ card_id });
    },

    createTrade: async (
      parent,
      { trader, recipient, offeredCard, requestedCard }
    ) => {
      const Trader = await User.findOne({ username: trader });
      const Recipient = await User.findOne({ username: recipient });

      // Fetch array of offered cards using their IDs
      const OfferedCards = await Card.find({ card_id: { $in: offeredCard } });
      const offeredCardIds = OfferedCards.map((card) => card._id);

      // Fetch array of requested cards using their IDs
      const RequestedCards = await Card.find({
        card_id: { $in: requestedCard },
      });
      const requestedCardIds = RequestedCards.map((card) => card._id);

      const newTrade = await Trade.create({
        trader: Trader._id,
        recipient: Recipient._id,
        offeredCard: offeredCardIds,
        requestedCard: requestedCardIds,
      });

      // Adding Trade to both Trader and Recipient
      await User.findByIdAndUpdate(
        Trader._id,
        {
          $addToSet: { trades: newTrade._id },
        },
        { new: true }
      );

      await User.findByIdAndUpdate(
        Recipient._id,
        {
          $addToSet: { trades: newTrade._id },
        },
        { new: true }
      );

      // Populate 'trader' field before returning
      const populatedTrade = await Trade.findById(newTrade._id)
        .populate("trader")
        .populate("recipient")
        .populate("offeredCard")
        .populate("requestedCard")
        .exec();

      return populatedTrade;
    },
    changeTradeStatus: async (parent, { _id, status }) => {
      // https://stackoverflow.com/questions/24300148/pull-and-addtoset-at-the-same-time-with-mongo
      //you cant $pull and $addToSet at the time must be seperate will cause a error
      const currentTrade = await Trade.findByIdAndUpdate(
        _id,
        { status },
        { new: true }
      );

      if (currentTrade.status === "accepted") {
        //recipient updates
        await User.findByIdAndUpdate(currentTrade.recipient, {
          $addToSet: { savedCards: { $each: currentTrade.offeredCard } },
        });

        await User.findByIdAndUpdate(currentTrade.recipient, {
          $pull: { savedCards: { $in: currentTrade.requestedCard } },
        });
        //trader upadtes

        await User.findByIdAndUpdate(currentTrade.trader, {
          $addToSet: { savedCards: { $each: currentTrade.requestedCard } },
        });

        await User.findByIdAndUpdate(currentTrade.trader, {
          $pull: { savedCards: { $in: currentTrade.offeredCard } },
        });
        await Trade.findByIdAndDelete(_id);
      } else if (currentTrade.status === "rejected") {
        await Trade.findByIdAndDelete(_id);
      }
    },
    editTrade: async (parent, { _id, request, offer }) => {
      const offeredCard = await Card.findOne({ card_id: offer });
      const requestedCard = await Card.findOne({ card_id: request });

      if (!requestedCard) {
        const currentTrade = await Trade.findByIdAndUpdate(
          { _id },
          { offeredCard },
          { new: true }
        );

        const populatedTrade = await Trade.findById(currentTrade._id)
          .populate("trader")
          .populate("recipient")
          .populate("offeredCard")
          .populate("requestedCard")
          .exec();

        return populatedTrade;
      } else {
        const currentTrade = await Trade.findByIdAndUpdate(
          { _id },
          { offeredCard },
          { requestedCard },
          { new: true }
        );

        const populatedTrade = await Trade.findById(currentTrade._id)
          .populate("trader")
          .populate("recipient")
          .populate("offeredCard")
          .populate("requestedCard")
          .exec();

        return populatedTrade;
      }
    },

  },
};

module.exports = resolvers;
