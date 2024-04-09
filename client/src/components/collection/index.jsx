import { useQuery } from "@apollo/client";
import { QUERY_CARDS } from "../../../utils/queries";
import { useState, useEffect } from "react";
import SavedCards from "../savedCards";
import "./style.css";

function Collection({ compare }) {
  const { loading: loadingCards, data: dataCards } = useQuery(QUERY_CARDS, {});
  const compareIds = Array.isArray(compare)
    ? compare.map((card) => card.card_id)
    : []; // mapping the ids
  // the reason i moved this line from prfoile and move it into the acutal component (in saveCards too) is because instead onlyhaving acess to the id i now have the entire object which means i can
  // sort by cards not owned bascially used did to add another quick feature//
  // query for all cards

  const allCards = dataCards?.cards || {}; // getting back data
  const allCardIds = Array.isArray(allCards)
    ? allCards.map((card) => card.card_id)
    : [];
  const [currentCards, setCards] = useState(allCards);
  //setting up state
  const [sortName, setSortName] = useState("asc");
  const [sortRarity, setSortRarity] = useState("asc");
  const [sortNumber, setSortNumber] = useState("asc");
  const [sortNot, setNot] = useState(false);
  const [view, setView] = useState(true);
  const [resetView, setResetView] = useState(0);

  // have to use useeffect to set the state because allCards will always be falsy({}) when i try to set the default value of the state currentCards
  useEffect(() => {
    // Update currentCards when dataCards changes
    setCards(allCards);
  }, [allCards]);
  if (loadingCards) {
    return <p>loading...</p>;
  }
  //if loading return loading...

  //next three functions
  //sorting algo
  // set the state so it redeners pretty musch same for all other functions
  const onSortNameClick = () => {
    const sortedCards = [...allCards].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sortName === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    setCards(sortedCards);
    setSortName(sortName === "asc" ? "desc" : "asc");
    setSortRarity(null);
    setSortNumber(null);
    setResetView((prevResetView) => prevResetView + 1);
  };

  const onSortNumberClick = () => {
    const sortedCards = [...allCards].sort((a, b) => {
      const numberA = a.card_id;
      const numberB = b.card_id;

      if (sortNumber === "asc") {
        return numberA - numberB;
      } else {
        return numberB - numberA;
      }
    });
    setCards(sortedCards);
    setSortNumber(sortNumber === "asc" ? "desc" : "asc");
    setSortName(null);
    setSortRarity(null);
    setResetView((prevResetView) => prevResetView + 1);
  };

  const onSortRarityClick = () => {
    const sortedCards = [...allCards].sort((a, b) => {
      const rarityOrder = ["common", "uncommon", "rare", "legendary"];
      const rarityA = rarityOrder.indexOf(a.rarity);
      const rarityB = rarityOrder.indexOf(b.rarity);

      if (sortRarity === "asc") {
        return rarityA - rarityB;
      } else {
        return rarityB - rarityA;
      }
    });
    setCards(sortedCards);
    setSortRarity(sortRarity === "asc" ? "desc" : "asc");
    setSortName(null);
    setSortNumber(null);
    setResetView((prevResetView) => prevResetView + 1);
  };

  const onSortNotOwnedClick = () => {
    setCards(compare);
    setNot(!sortNot);
    setSortName(null);
    setSortNumber(null);
    setSortRarity(null);
  };
  // change view from tabel to a sort of book view
  const onViewClick = () => {
    setView(!view);
  };

  return (
    <>
      <div className="buttonDiv">
        {/* event listen for the functions  */}
        <button onClick={onViewClick}>View</button>
        <button onClick={onSortNumberClick}>Card ID</button>
        <button onClick={onSortRarityClick}>Rarity</button>
        <button onClick={onSortNameClick}>Name</button>
        <button onClick={onSortNotOwnedClick}>Not Owned</button>
        <button
          onClick={() => {
            setCards(allCards);
          }}
        >
          Reset
        </button>
      </div>
      <div key={resetView}>
        {view ? (
          <>
            <div className="color-key">
              <div className="color-key-item">
                <div className="dont-own"></div>
                <div>You don't own the card</div>
              </div>
              <div className="color-key-item">
                <div className="own"></div>
                <div>You own this card</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th onClick={onSortNumberClick}>Card ID</th>
                  <th onClick={onSortRarityClick}>Rarity</th>
                  <th onClick={onSortNameClick}>Name</th>
                </tr>
              </thead>
              <tbody>
                {/* if i dont use the array object to check if it an array i get a .map is not a method error */}

                {Array.isArray(currentCards) && currentCards.length > 0 ? (
                  currentCards.map((card, index) => (
                    <tr
                      key={index}
                      style={{
                        //compare parameter can be found in the props and takes in an array of ids  if you check savedCards component each card now has its own id
                        // cards with an id that includes compare with have a yellow background
                        //the parameter that is passed in is coming from the query that i created today so it will return cards that the user doesnt own
                        // can be style better ofc
                        backgroundColor: compareIds.includes(card.card_id)
                          ? "yellow"
                          : "lightyellow",
                      }}
                    >
                      <td>{card.card_id}</td>
                      <td className={card.rarity}>{card.rarity}</td>
                      <td>{card.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No cards found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            {/* saveCards now has props for compare which does the same thing as mentioned above  */}
            <div className="color-key">
              <div className="color-key-item">
                <div className="cardViewDont-own"></div>
                <div>You don't own the card</div>
              </div>
              <div className="color-key-item">
                <div className="cardViewOwn"></div>
                <div>You own this card</div>
              </div>
            </div>
            <SavedCards
              savedCards={currentCards}
              compare={compare}
            ></SavedCards>
          </>
        )}
      </div>
    </>
  );
}

export default Collection;
