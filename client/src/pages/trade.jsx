import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TRADE } from "../../utils/mutations";
import "./trade.css";
import { QUERY_USERS } from "../../utils/queries";
import Trades from "../components/trades";
import Auth from "../../utils/auth";

function TradePage() {
  const profile = Auth.getProfile();
  const username = profile?.data?.username || "";

  const [formState, setFormState] = useState({
    trader: username,
    recipient: "",
    offeredCard: "",
    requestedCard: "",
  });

  const { loading, data } = useQuery(QUERY_USERS);
  console.log("Loading state: ", loading);
  console.log("Data object: ", data);

  const [createTrade] = useMutation(CREATE_TRADE, {
    variables: formState,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await createTrade();
    window.location.reload();
  };

  // console.log("BOB123", data.users);

  console.log("BOB123", formState.recipient);

  return (
    <div className="parentContainer">
      {Auth.loggedIn() ? (
        <>
          <h1>Trade Page</h1>

          <form onSubmit={handleFormSubmit}>
            <label htmlFor="trader">Trader:</label>
            <input
              name="trader"
              value={formState.trader}
              type="text"
              placeholder="Trader"
            />
            <label htmlFor="recipient">Recipient:</label>
            <select
              id="recipient"
              name="recipient"
              value={formState.recipient}
              onChange={handleInputChange}
            >
              <option value="">Select a recipient...</option>
              {loading ? (
                <option>Loading...</option>
              ) : (
                data?.users
                  ?.filter((user) => user.username !== username)
                  .map((user) => (
                    <option key={user._id} value={user.username}>
                      {user.username}
                    </option>
                  ))
              )}
            </select>
            <label htmlFor="offeredCard">Offered Card:</label>
            <select
              id="offeredCard"
              name="offeredCard"
              value={formState.offeredCard}
              onChange={handleInputChange}
            >
              <option value="">Select a card...</option>
              {loading ? (
                <option>Loading...</option>
              ) : (
                data?.users
                  ?.find((user) => user.username === username)
                  ?.savedCards.map((card) => (
                    <option key={card._id} value={card.card_id}>
                      {card.name}
                    </option>
                  ))
              )}
            </select>
            <label htmlFor="requestedCard">Requested Card:</label>
            <select
              id="requestedCard"
              name="requestedCard"
              value={formState.requestedCard}
              onChange={handleInputChange}
            >
              <option value="">Select a card...</option>
              {loading ? (
                <option>Loading...</option>
              ) : (
                data?.users
                  ?.find((user) => user.username === formState.recipient)
                  ?.savedCards.map((card) => (
                    <option key={card._id} value={card.card_id}>
                      {card.name}
                    </option>
                  ))
              )}
            </select>

            <button type="submit">Submit</button>
          </form>
          <Trades></Trades>
        </>
      ) : (
        <h1>Must Be Logged In</h1>
      )}
    </div>
  );
}

export default TradePage;
