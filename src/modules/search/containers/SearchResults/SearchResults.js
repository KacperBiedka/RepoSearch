/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateSearchError } from "../../../../actions";
import GithubApi from "../../../../api/GithubApi";
import Input from "../../../../components/Input/Input";
import Loader from "../../../../components/Loader/Loader";
import StatusHero from "../../components/StatusHero/StatusHero";
import ResultsTable from "../../components/ResultsTable/ResultsTable";
import useUrlSearchParams from "../../../../hooks/useUrlSearchParams";
import {
  sortByField,
  getCacheValue,
  updateCacheValue,
} from "../../../../helpers/index";
import classes from "./SearchResults.module.scss";

const SearchResults = ({ history }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [prevSearchResults, setPrevSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationNumbers, setPaginationNumbers] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [rowNumber, setRowNumber] = useState(10);
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

  // Retrieve search param values with useLocation()
  const urlQuery = useUrlSearchParams("query");
  const urlField = useUrlSearchParams("field");
  const urlOrder = useUrlSearchParams("order");

  const getCachedValues = () => {
    getCacheValue("perPage", (number) => setPerPage(number));
    getCacheValue("prevResults", (results) => setPrevSearchResults(results));
    getCacheValue("currentPage", (page) => setCurrentPage(page));
  };

  const retrieveUrlValues = () => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
      setIsLoading(true);
    }
    if (urlField && urlOrder) {
      updateActiveFilter(urlField, urlOrder);
    }
  };

  useEffect(() => {
    getCachedValues();
    retrieveUrlValues();
  }, []);

  const fetchData = async (cachedResults = null) => {
    setIsLoading(true);
    if (cachedResults) {
      dispatch(updateSearchError(null));
      addSearchEntry(searchQuery, cachedResults);
      extractListData(cachedResults);
    } else {
      const githubApi = new GithubApi(
        "https://api.github.com/search/repositories?q="
      );
      const results = await githubApi.getSearchResults(searchQuery);
      if (results.data) {
        addSearchEntry(searchQuery, results.data);
      }
      dispatch(updateSearchError(results.error));
      extractListData(results.data);
      updateCurrentPage(1);
    }
    setIsLoading(false);
  };

  const updateCurrentPage = (number) => {
    setCurrentPage(number);
    updateCacheValue("currentPage", number);
  };

  const updatePaginationNumber = (number) => {
    setPerPage(number);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        const cachedResult = prevSearchResults.find(
          (result) => result.query === searchQuery
        );
        if (cachedResult) {
          fetchData(cachedResult.data);
        } else {
          fetchData();
        }
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
    calculatePaginationNumbers(displayData, perPage);
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
    history.push({
      pathname: "/",
      search: `?query=${searchQuery}&field=${filter.field}&order=${filter.order}`,
    });
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

  const calculatePaginationNumbers = (array, perPageNumber) => {
    const newPagination = [];
    if (array) {
      for (let i = 1; i <= Math.ceil(array.length / perPageNumber); i++) {
        newPagination.push(i);
      }
      setPaginationNumbers(newPagination);
    }
  };

  const addSearchEntry = (query, data) => {
    setLastSearch(query);
    updateCacheValue("lastSearch", query);
    const activeFilter = filters.find((filter) => filter.active);
    history.push({
      pathname: "/",
      search: `?query=${query}&field=${activeFilter.field}&order=${activeFilter.order}`,
    });
    const prevResults = [...prevSearchResults];
    setPrevSearchResults(prevResults);
    const matchingField = prevResults.find((result) => result.query === query);
    if (!matchingField) {
      prevResults.push({
        query,
        data,
      });
    }
    setPrevSearchResults(prevResults);
    updateCacheValue("prevResults", prevResults);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const parsedNumber = parseInt(perPage);
      if (parsedNumber > 0) {
        calculatePaginationNumbers(searchResults, parsedNumber);
        updateCacheValue("perPage", parsedNumber);
        if (searchResults) {
          if (Math.ceil(searchResults.length / parsedNumber) < currentPage) {
            updateCurrentPage(1);
          }
        }
        setRowNumber(parsedNumber);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [perPage]);

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
          perPage={perPage}
          rowNumber={rowNumber}
          currentPage={currentPage}
          perPageCallback={updatePaginationNumber}
          paginationNumbers={paginationNumbers}
          updateCurrentPage={updateCurrentPage}
        />
      )}
    </div>
  );
};

export default withRouter(SearchResults);
