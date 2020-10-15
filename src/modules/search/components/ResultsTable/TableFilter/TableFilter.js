import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import classes from "./TableFilter.module.scss";

const TableFilter = ({ filter, sortData, index }) => {
  return (
    <th
      data-test="filter-header-cell"
      onClick={() => sortData(index)}
      className={filter.order === "asc" ? classes.asc : classes.desc}
    >
      {filter.name}{" "}
      <FontAwesomeIcon
        data-test="filter-chevron-icon"
        className={
          classes.chevron + " " + (filter.active ? classes.active : "")
        }
        icon={["fas", "chevron-down"]}
      />
    </th>
  );
};

export default TableFilter;
