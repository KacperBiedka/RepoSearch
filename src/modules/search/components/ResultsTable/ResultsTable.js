import React from "react";
import classes from "./ResultsTable.module.scss";

const ResultsTable = ({ repoData }) => {
  return (
    <div className={classes.tableWrapper}>
      {repoData && repoData.length > 0 ? (
        <div className={classes.tableContainer}>
          <table
            data-test="search-results-table"
            className={classes.resultsTable}
          >
            <tbody>
              {repoData.map((item) => {
                return (
                  <tr data-test="results-table-body-row" key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.owner}</td>
                    <td>{item.stars}</td>
                    <td>{item.created_at}</td>
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
