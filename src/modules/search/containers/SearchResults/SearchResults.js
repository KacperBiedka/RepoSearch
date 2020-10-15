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
import { sortByField } from "../../../../helpers/index";
import classes from "./SearchResults.module.scss";

const SearchResults = ({ history }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [prevSearchResults, setPrevSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [filters, setFilters] = useState([
    {
      name: "Name",
      field: "name",
      order: "asc",
      active: true,
    },
    {
      name: "Owner",
      field: "owner",
      order: "asc",
      active: false,
    },
    {
      name: "Stars",
      field: "stars",
      order: "asc",
      active: false,
    },
    {
      name: "Created at",
      field: "created_at",
      order: "asc",
      active: false,
    },
  ]);

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
        const activeFilter = filters.find((filter) => filter.active);
        displayData = sortByField(
          displayData,
          activeFilter.field,
          activeFilter.order
        );
        updateActiveFilter(activeFilter.field, activeFilter.order);
      }
    }
    setSearchResults(displayData);
  };

  const sortData = (index) => {
    const updatedFilters = [...filters];
    const filter = updatedFilters[index];
    const sortedArray = sortByField(searchResults, filter.field, filter.order);
    setSearchResults([...sortedArray]);
    updatedFilters.map((filter) => {
      return (filter.active = false);
    });
    setFilters(updatedFilters);
    if (filter.order === "asc") {
      filter.order = "desc";
    } else {
      filter.order = "asc";
    }
    filter.active = true;
    updatedFilters[index] = filter;
  };

  const updateActiveFilter = (field, order) => {
    const updatedFilters = [...filters];
    const activeIndex = filters.findIndex((filter) => filter.field === field);
    const newFilter = updatedFilters[activeIndex];
    newFilter.order = order;
    updatedFilters.map((filter) => {
      return (filter.active = false);
    });
    newFilter.active = true;
    if (order === "asc") {
      newFilter.order = "desc";
    } else {
      newFilter.order = "asc";
    }
    updatedFilters[activeIndex] = newFilter;
    setFilters(updatedFilters);
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
      {isLoading ? (
        <Loader />
      ) : (
        <ResultsTable
          repoData={searchResults}
          filters={filters}
          sortData={sortData}
        />
      )}
    </div>
  );
};

export default withRouter(SearchResults);
