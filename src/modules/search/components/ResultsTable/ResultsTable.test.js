import React from "react";
import { shallow } from "enzyme";
import { findByTestAttr } from "../../../../../test/testUtils";
import ResultsTable from "./ResultsTable";
import repoData from "../../__test__/mockData/extractedResults";

const filters = [
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
];

const defaultProps = {
  perPage: 30,
  rowNumber: 30,
  currentPage: 1,
  filters,
};

const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<ResultsTable {...setupProps} />);
};

describe("if valid data is provided", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({ repoData });
  });
  test("displays the results table", () => {
    const table = findByTestAttr(wrapper, "search-results-table");
    expect(table.length).toBe(1);
  });
  test("displays correct number of data entry rows", () => {
    const tableRows = findByTestAttr(wrapper, "results-table-body-row");
    expect(tableRows.length).toBe(30);
  });
  test("does not display the empty results message", () => {
    const message = findByTestAttr(wrapper, "empty-results-message");
    expect(message.length).toBe(0);
  });
});

describe("if there is no data", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({ repoData: null });
  });
  test("does not display the results table", () => {
    const table = findByTestAttr(wrapper, "search-results-table");
    expect(table.length).toBe(0);
  });
  test("displays the empty results message", () => {
    const message = findByTestAttr(wrapper, "empty-results-message");
    expect(message.length).toBe(1);
  });
});
