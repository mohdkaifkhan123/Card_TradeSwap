import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_USERS, QUERY_USER } from "../../utils/queries";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Auth from "../../utils/auth";
import "./UserSearchPage.css";

const UserSearchPage = () => {
  const profile = Auth.getProfile();
  const username = profile?.data?.username;

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const { loading, data } = useQuery(QUERY_USERS);
  const { loading: loadingUser, data: userData } = useQuery(QUERY_USER, {
    variables: { username: searchParams },
  });

  useEffect(() => {
    if (searchTerm) {
      const newSuggestions = data.users
        .filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((user) => user.username);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsSearchActive(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchParams(searchTerm);
    setIsSearchActive(true);
    navigate(`/${searchTerm}`);
  };

  console.log("Search input", searchParams);
  console.log("selected User", userData);

  return (
    <div className="container">
      <h1>Search Other Users Collections</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          list="user-suggestions"
        />
        <datalist id="user-suggestions">
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.users
            .filter((user) => user.username !== username)
            .map((user) => (
              <tr
                className="userRow"
                key={user._id}
                onClick={() => handleUserClick(user)}
              >
                <td>
                  <Link to={`/${user.username}`}> {user.username} </Link>
                </td>
                <td>{user.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserSearchPage;
