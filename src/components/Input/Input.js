import React from "react";
import classes from "./Input.module.scss";

/**
 * Generic Input component meant to be used between different modules
 * @param {string} value
 * @param {function} callback
 * @param {input Dom elemnent options} options
 */

const Input = ({ value, changeCallback, options = {} }) => {
  const handleChange = (e) => {
    changeCallback(e.target.value);
  };
  return (
    <input
      className={classes.input}
      type="text"
      value={value}
      onChange={handleChange}
      {...options}
    />
  );
};

export default Input;
