const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedCards: [Card]
    trades:[Trade]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Card {
    _id: ID
    card_id: ID
    name: String
    rarity: String
    description: String
  }

   type Trade {
    _id: ID!
    trader: User
    recipient: User
    offeredCard: [Card]
    requestedCard: [Card]
    status: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    cards: [Card]
    card(card_id: ID!): Card
    cardPack: [Card]
    rareCardPack: [Card]
    me: User
    trades: [Trade]
    compareCards(username:String,logged:String!):[Card]
  }

  type Mutation{
    addUser(username:String!,email:String!,password:String!):Auth
    login(email: String!, password: String!): Auth
    removeUser(username:String!):User 
    addCardsToUser(username: String!, card_ids: [ID]!): User
    removeCardFromUser(username:String!,card_id:ID!):User
    addCard(card_id:ID!,name:String!,rarity:String!,description:String!):Card
    removeCard(card_id:ID!):Card
    createTrade(
      trader: String!
      recipient: String!
      offeredCard: [ID]
      requestedCard: [ID]!
    ): Trade
      changeTradeStatus(_id:ID!,status:String!):Trade
       editTrade(_id: ID!, request: [ID], offer: [ID]!): Trade
  }
`;

module.exports = typeDefs;
