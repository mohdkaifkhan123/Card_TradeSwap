import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";
import Nav from "./components/nav";
import Footer from "./components/footer";
const httpLink = createHttpLink({
  uri: "graphql",
});
import "./App.css";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="appContainer">
        <Nav></Nav>
        <div className="mainContent">
          <Outlet />
        </div>
        <Footer></Footer>
      </div>
    </ApolloProvider>
  );
}

export default App;
