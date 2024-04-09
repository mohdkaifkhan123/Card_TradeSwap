import { gql } from "@apollo/client";

export const Query_ME = gql`
  query Query {
    me {
      _id
      email
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

export const QUERY_USER = gql`
  query Query($username: String!) {
    user(username: $username) {
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
        trader {
          _id
          username
          email
          password
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
  }
`;
export const QUERY_USERS = gql`
  query Query {
    users {
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
        trader {
          _id
          username
          email
          password
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
  }
`;

export const QUERY_PACK = gql`
  query Query {
    cardPack {
      _id
      card_id
      name
      rarity
      description
    }
  }
`;

export const QUERY_RAREPACK = gql`
  query RareCardPack {
    rareCardPack {
      _id
      card_id
      name
      rarity
      description
    }
  }
`
export const COMPARE_CARDS= gql`
query Query($logged: String!, $username: String) {
  compareCards(logged: $logged, username: $username) {
    _id
    card_id
    name
    rarity
    description
  }
}
`

export const QUERY_CARDS=gql`
query Query {
  cards {
    _id
    card_id
    name
    rarity
    description
  }
}

`
;

