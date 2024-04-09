import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        savedCards {
          card_id
          name
          rarity
          description
        }
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        _id
        username
        email
        savedCards {
          card_id
          name
          rarity
          description
        }
      }
      token
    }
  }
`;

export const ADD_CARD = gql`
  mutation Mutation($username: String!, $cardIds: [ID]!) {
    addCardsToUser(username: $username, card_ids: $cardIds) {
      _id
      username
      email
      password
      savedCards {
        _id
        card_id
        name
        rarity
        description
      }
    }
  }
`;

export const DELETE_CARD = gql`
  mutation RemoveCardFromUser($username: String!, $cardId: ID!) {
    removeCardFromUser(username: $username, card_id: $cardId) {
      username
      savedCards {
        _id
        card_id
        name
        rarity
        description
      }
    }
  }
`;

export const CREATE_TRADE = gql`
  mutation Mutation(
    $trader: String!
    $recipient: String!
    $offeredCard: [ID]!
    $requestedCard: [ID]!
  ) {
    createTrade(
      trader: $trader
      recipient: $recipient
      offeredCard: $offeredCard
      requestedCard: $requestedCard
    ) {
      _id
      trader {
        _id
        username
        email
        password
        savedCards {
          _id
          card_id
          name
          rarity
          description
        }
        trades {
          _id
          status
        }
      }
      recipient {
        _id
        username
        email
        password
      }
      offeredCard {
        _id
        card_id
        name
        rarity
        description
      }
      requestedCard {
        _id
        card_id
        name
        rarity
        description
      }
      status
    }
  }
`;

export const ACCEPT_TRADE = gql`
  mutation Mutation($id: ID!, $status: String!) {
    changeTradeStatus(_id: $id, status: $status) {
      _id
      trader {
        _id
        username
        email
        savedCards {
          _id
          card_id
          name
          rarity
          description
        }
      }
      recipient {
        _id
        email
        savedCards {
          _id
          card_id
          name
          rarity
          description
        }
        username
      }
      offeredCard {
        _id
        card_id
        name
        rarity
        description
      }
      requestedCard {
        _id
        card_id
        name
        rarity
        description
      }
      status
    }
  }
`;

export const CHANGE_TRADE_STATUS = gql`
  mutation Mutation($id: ID!, $status: String!) {
    changeTradeStatus(_id: $id, status: $status) {
      _id
      trader {
        _id
        username
        email
        password
        savedCards {
          _id
          card_id
          name
          rarity
          description
        }
        trades {
          _id
          status
        }
      }
      recipient {
        _id
        username
        email
        password
      }
      offeredCard {
        _id
        card_id
        name
        rarity
        description
      }
      requestedCard {
        _id
        card_id
        name
        rarity
        description
      }
      status
    }
  }
`;

