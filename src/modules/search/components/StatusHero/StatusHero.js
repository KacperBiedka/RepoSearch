import React from "react";
import classes from "./StatusHero.module.scss";
import { useSelector } from 'react-redux';

const StatusHero = ({ value }) => {
    const searchError = useSelector((state) => {
    return state.searchReducer.searchError;
  });
  return (
    <h1
      data-test="status-hero"
      className={
        classes.hero +
        " " +
        (searchError ? classes.error : value ? classes.success : "")
      }
    >
      {searchError
        ? searchError
        : value
        ? `Search results for: ${value}`
        : "Search for anything :)"}
    </h1>
  );
};

export default StatusHero;
