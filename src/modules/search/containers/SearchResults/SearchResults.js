/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import GithubApi from "../../../../api/GithubApi";
import Input from "../../../../components/Input/Input";
import Loader from "../../../../components/Loader/Loader";
import StatusHero from "../../components/StatusHero/StatusHero";
import ResultsTable from "../../components/ResultsTable/ResultsTable";
import { useDispatch } from "react-redux";
import { updateSearchError } from "../../../../actions";
import classes from "./SearchResults.module.scss";

const SearchResults = ({ history }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [prevSearchResults, setPrevSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");

  const dispatch = useDispatch();

  const fetchData = async () => {
    setIsLoading(true);
    const githubApi = new GithubApi(
      "https://api.github.com/search/repositories?q="
    );
    const results = await githubApi.getSearchResults(searchQuery);
    if (results.data) {
      addSearchEntry(searchQuery);
    }
    dispatch(updateSearchError(results.error));
    extractListData(results.data);
    setIsLoading(false);
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
      <StatusHero value={lastSearch} />
      <Input
        value={searchQuery}
        changeCallback={(keyword) => setSearchQuery(keyword)}
      />
      {isLoading ? <Loader /> : <ResultsTable repoData={searchResults} />}
    </div>
  );
};

export default withRouter(SearchResults);
