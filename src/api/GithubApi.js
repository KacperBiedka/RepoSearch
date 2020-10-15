/**
 * helper GithubApi class with basic validation
 * the flexible structure allows for easy usage outside of the search module
 * custom url, options and query values can be provided to suit your needs :)
 */

export default class GithubApi {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
  }
  _validateKeyword(query) {
    if (query.length > 20) {
      return {
        query: null,
        error: "Please use a shorter word",
      };
    } else if (query.trim().length > 0) {
      return {
        query,
        error: null,
      };
    } else {
      return {
        query: null,
        error: "Empty search parameter",
      };
    }
  }

  async getSearchResults(query) {
    const searchValue = this._validateKeyword(query);
    if (searchValue.error) {
      return {
        data: null,
        error: searchValue.error,
      };
    } else {
      const url = this.url + searchValue.query;
      const res = await fetch(url, this.options);
      return res
        .json()
        .then((res) => {
          return {
            data: res,
            error: null,
          };
        })
        .catch((error) => {
          return {
            data: null,
            error: error.message,
          };
        });
    }
  }
}
