import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardImg,
  CardTitle,
  CardSubtitle,
  CardBody,
  Badge,
} from "reactstrap";
import classes from "./ArticleCard.module.css";

export function timeStampToString(ts) {
  const date = new Date(ts * 1000);
  return (
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
  );
}

const ArticleCard = (props) => {
  return (
    <Card className={classes.ArticleCard}>
      <Link
        to={{
          pathname: "article/" + props.data.id,
          state: { article: props.data },
        }}
      >
        <CardImg
          top
          width="100%"
          src={props.data.featureImage}
          alt="Card Image"
          className={classes.CardImage}
        />
      </Link>
      <CardBody className={classes.CardBody}>
        <CardTitle className={classes.CardTitle}>
          <Link
            to={{
              pathname: "article/" + props.data.id,
              state: { article: props.data },
            }}
          >
            {props.data.title}
          </Link>
        </CardTitle>

        <CardSubtitle className={classes.CardSubtitle}>
          <Badge className={classes.ArticleLabel}>
            {props.data.categoryLabel}
          </Badge>
          <Badge className={classes.createDate}>
            {timeStampToString(props.data.createDate.seconds)}
          </Badge>
        </CardSubtitle>
      </CardBody>
    </Card>
  );
};

export default ArticleCard;
