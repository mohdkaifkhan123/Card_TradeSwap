import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Collection from "../components/collection";
import Auth from "../../utils/auth";
import SavedCards from "../components/savedCards";
import { QUERY_USER, COMPARE_CARDS, Query_ME } from "../../utils/queries";
import { useState } from "react";
import "./profile.css";

function ProfilePage() {
  const profile = Auth.getProfile();
  const username = profile?.data?.username; // getting the logged in users username

  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : Query_ME, {
    variables: { username: userParam },
  }); // getting the other users information based on the parameter provided in the url

  const { loading: loadingCompare, data: dataCompare } = useQuery(
    COMPARE_CARDS,
    {
      variables: { logged: username, username: userParam },
    }
  );
  //using the query in the resolver to compare the logged in the user (logged parameter) with the other user (username parameter)

  const user = data?.me || data?.user || {}; // getting back info either from the query me or query user
  const [showCompare, setCompare] = useState(false); // state to control rendering of the collect(pokedex)

  const compareCards = dataCompare?.compareCards || []; //getting back cards

  const onCompareClick = () => {
    setCompare(!showCompare);
  }; // chanign the state

  // use that youtube short method to render the compare table
  const renderCompare = () => {
    if (showCompare) {
      return <Collection compare={compareCards} />;
    } else {
      return null;
    }
  };
  // if you're logged in go to /me page (profile)
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  } // if loading user data loading div

  if (!user || !user.username) {
    return <h1>Must Be Logged In</h1>;
  } // must be logged in

  return (
    <div className="container">
      <section id="profile">
        <h1>
          {username === user.username
            ? `Hello ${username}!`
            : `Welcome to ${user.username}'s page`}
        </h1>

        <div className="color-explanation">
          <p>
            {username === user.username
              ? `These are the cards you have collected`
              : `Greyed out cards indicate you have not collected that card yet.`}
          </p>
        </div>

        {showCompare ? ( //renders compare table if showcompare is true and a cancel button
          <div className="inventoryContainer">
            <button className="inventoryBtn" onClick={() => setCompare(false)}>
              Return
            </button>
            {renderCompare()}
          </div>
        ) : (
          <div className="inventoryContainer">
            {!userParam ? ( // if you no userparam is provided ( meaning you're on your own profile you can compare your cards with ALL cards)
              <>
                <button className="inventoryBtn" onClick={onCompareClick}>
                  Compare Cards With Inventory
                </button>
                <SavedCards
                  savedCards={user.savedCards}
                  cardOwner={user.username}
                  compare={compareCards}
                />
              </>
            ) : (
              // if on anothers page you cant do that
              <SavedCards
                savedCards={user.savedCards}
                cardOwner={user.username}
                compare={compareCards}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
