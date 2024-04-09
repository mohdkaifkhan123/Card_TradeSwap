import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_PACK, Query_ME, QUERY_RAREPACK } from "../../utils/queries";
import { ADD_CARD } from "../../utils/mutations";
import "./home.css";
import Auth from "../../utils/auth";
import Card1 from "../assets/resources/card1.png";
import packImg from "../assets/resources/pack.png";

const Home = () => {
  const [cards, setCards] = useState([]);
  const cardsToSave = [...cards];
  const [select, setSelect] = useState(cardsToSave.map(() => false));

  const { loading: loadingPack, data: dataPack } = useQuery(QUERY_PACK, {
    fetchPolicy: "no-cache",
  });

  const { loading: loadingRarePack, data: rareDataPack } = useQuery(
    QUERY_RAREPACK,
    {
      fetchPolicy: "no-cache",
    }
  );

  const { loading: loadingMe, data: dataMe } = useQuery(Query_ME, {
    fetchPolicy: "no-cache",
  });

  const username = dataMe?.me.username || "";

  const [addCardToUser, { error }] = useMutation(ADD_CARD);

  const openPack = () => {
    const fetchData = dataPack?.cardPack || [];
    console.log("fetchData", fetchData);
    setCards(fetchData);
  };

  const openRarePack = () => {
    const fetchData = rareDataPack?.rareCardPack || [];
    console.log("fetchRareData", fetchData);
    setCards(fetchData);
  };

  const onCheckboxChange = (index) => {
    const updatedSelect = [...select];
    updatedSelect[index] = !updatedSelect[index];
    setSelect(updatedSelect);
  };

  const onClick = async () => {
    const selectedItems = cardsToSave.filter((item, index) => select[index]);
    const selectedCardIds = selectedItems.map((item) => item.card_id);

    try {
      const { data } = await addCardToUser({
        variables: { username: username, cardIds: selectedCardIds },
      });
      console.log("Cards saved successfully:", data);
      window.location.assign("/");
    } catch (error) {
      console.error("Error saving cards:", error);
    }
  };

  return (
    <div className="container">
      {Auth.loggedIn() ? (
        <div>
          <h1>Hello {username}</h1>
          {cards.length === 0 ? (
            <div className="openPackBtn">
              <h2>Common Pack</h2>
              <img className="packImg" src={packImg} alt="Pack image" />
              <button
                type="button"
                className="btn btn-light"
                onClick={openPack}
              >
                Open Pack
              </button>
              {/* rare pack */}
              <h2>Rare Pack</h2>
              <img className="rarePackImg" src={packImg} alt="Pack image" />
              <button
                type="button"
                className="btn btn-light"
                onClick={openRarePack}
              >
                Open Pack
              </button>
            </div>
          ) : (
            <>
              <div className="parent-container">
                <button
                  onClick={onClick}
                  type="button"
                  className="btn btn-light"
                >
                  Confirm
                </button>
                <p>
                  Please select the cards you wish to save then click confirm.
                </p>
                <div className="card-container">
                  {cards.map((card, index) => (
                    <div key={card._id} className="card">
                      <img
                        className="card-img-top"
                        src={Card1}
                        alt="Card image cap"
                      />
                      <h2>{card.name}</h2>
                      <h3 className={card.rarity}>{card.rarity}</h3>
                      {console.log("card rarity", card.rarity)}
                      <input
                        type="checkbox"
                        onChange={() => onCheckboxChange(index)}
                        checked={select[index] || false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <h1>Must be logged in</h1>
          <div className="about">
            <h2>About</h2>
            <p>
              Welcome to our trading card game. Our website allows you to
              collect and trade unique cards with other users on the platform.
              The first step is to create an account. Once you have created the
              account you will be able to open packs of cards and decide if you
              want to collect the card or discard it. Pretty simple, right? In
              the trading page you can propose trades with other users. By using
              the search user page you can view which users have which cards so
              you can plan your trades. Finally you can track your journey to
              collect all the cards in the profile page. We hope you enjoy
              collecting and trading our cards!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
