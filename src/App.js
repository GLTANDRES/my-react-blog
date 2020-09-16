import React from "react";
import Main from "./Layout/Homepage/Main/Main";
import Heading from "./Layout/Homepage/Heading/Heading";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { getReduxStore, getRrfProp } from "./Config/firebase-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import "./App.css";
import ViewArticle from "./Layout/ViewArticle/ViewArticle";
import NewArticle from "./Layout/NewArticle/NewArticle";
import LoginPage from "./Layout/LoginPage/LoginPage";

import RouterManager from "./Layout/RouterManager/RouterManager";

function App() {
  return (
    <div className="App">
      <Provider store={getReduxStore()}>
        <ReactReduxFirebaseProvider {...getRrfProp()}>
          <Router>
            <RouterManager />
          </Router>
        </ReactReduxFirebaseProvider>
      </Provider>
    </div>
  );
}

export default App;
