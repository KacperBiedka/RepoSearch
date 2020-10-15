/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Input from "../../../../components/Input/Input";
import classes from "./SearchResults.module.scss";
import GithubApi from "../../../../api/GithubApi";
import { withRouter } from "react-router-dom";

const SearchResults = ({ history }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [prevSearchResults, setPrevSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");

  const fetchData = async () => {
    const githubApi = new GithubApi(
      "https://api.github.com/search/repositories?q="
    );
    const results = await githubApi.getSearchResults(searchQuery);
    if (results.data) {
      addSearchEntry(searchQuery, results.data);
    }
    extractListData(results.data);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        fetchData();
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const extractListData = (data) => {
    let displayData = null;
    if (data) {
      if (data.items.length > 0) {
        displayData = data.items.map((item) => {
          return {
            name: item.name,
            owner: item.owner.login,
            stars: item.stargazers_count,
            created_at: item.created_at,
            id: item.id,
          };
        });
      }
    }
    setSearchResults(displayData);
  };

  const addSearchEntry = (query) => {
    setLastSearch(query);
    const prevResults = [...prevSearchResults];
    setPrevSearchResults(prevResults);
  };

  return (
    <div data-test="search-results" className={classes.searchResults}>
      <Input
        value={searchQuery}
        changeCallback={(keyword) => setSearchQuery(keyword)}
      />
    </div>
  );
};

export default withRouter(SearchResults);
