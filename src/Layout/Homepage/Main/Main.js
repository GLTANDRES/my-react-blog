import React, { Component } from "react";
import { Container } from "reactstrap";
import firebase from "../../../Config/firebase";
import ArticleCard from "../../../Component/ArticleCard/ArticleCard";

const db = firebase.firestore();

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      articles: [],
    };
  }
  componentDidMount() {
    this.getMyArticles();
  }

  getMyArticles = () => {
    db.collection("Article")
      .limit(8)
      .get()
      .then((docs) => {
        if (!docs.empty) {
          let allArticles = [];
          docs.forEach(function (doc) {
            const article = {
              id: doc.id,
              ...doc.data(),
            };
            allArticles.push(article);
          });
          this.setState(
            {
              articles: allArticles,
            },
            () => {
              this.setState({
                isLoaded: true,
              });
            }
          );
        }
      });
  };

  render() {
    return (
      <div>
        <Container>
          {this.state.isLoaded
            ? this.state.articles.map((article, index) => {
                return <ArticleCard key={index} data={article} />;
              })
            : ""}
        </Container>
      </div>
    );
  }
}

export default Main;
