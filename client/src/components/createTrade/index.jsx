import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TRADE } from "../../../utils/mutations";
import { QUERY_USERS } from "../../../utils/queries";
import Auth from "../../../utils/auth";
import "./style.css";

function CreateTrade({ recipient, requestedCard }) {
  const navigate = useNavigate();
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

  const [createTrade, { error, dataTrade }] = useMutation(CREATE_TRADE);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!recipient || !requestedCard) {
      const { dataTrade } = await createTrade({ variables: { ...formState } });
    } else {
      const { dataTrade } = await createTrade({
        variables: {
          trader: formState.trader,
          recipient: recipient,
          offeredCard: formState.offeredCard,
          requestedCard: requestedCard,
        },
      });
    }
    navigate("/trade");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          name="trader"
          value={formState.trader}
          type="text"
          placeholder="Trader"
        />
        <label htmlFor="recipient">Recipient:</label>
        {recipient ? (
          <input value={recipient} />
        ) : (
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
        )}

        <label htmlFor="offeredCard">Offered Card:</label>
        <select
          id="offeredCard"
          name="offeredCard"
          value={formState.offeredCard}
          onChange={handleInputChange}
        >
          <option value="">Select a card to offer...</option>
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
        {requestedCard ? (
          <input value={requestedCard}></input>
        ) : (
          <select
            id="requestedCard"
            name="requestedCard"
            value={formState.requestedCard}
            onChange={handleInputChange}
          >
            <option value="">Select a card to request...</option>
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
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default CreateTrade;
