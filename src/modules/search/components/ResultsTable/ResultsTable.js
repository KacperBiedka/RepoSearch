import React from "react";
import { v4 as uuid } from "uuid";
import TableFilter from "./TableFilter/TableFilter";
import { convertAtomDate } from "../../../../helpers/index";
import classes from "./ResultsTable.module.scss";

const ResultsTable = ({ repoData, filters, sortData }) => {
  return (
    <div className={classes.tableWrapper}>
      {repoData && repoData.length > 0 ? (
        <div className={classes.tableContainer}>
          <table
            data-test="search-results-table"
            className={classes.resultsTable}
          >
            <thead>
              <tr>
                {filters.map((filter, index) => {
                  return (
                    <TableFilter
                      key={uuid()}
                      index={index}
                      filter={filter}
                      sortData={sortData}
                    />
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {repoData.map((item) => {
                return (
                  <tr data-test="results-table-body-row" key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.owner}</td>
                    <td>{item.stars}</td>
                    <td>{convertAtomDate(item.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h2 data-test="empty-results-message">No results :(</h2>
      )}
    </div>
  );
};

export default ResultsTable;
