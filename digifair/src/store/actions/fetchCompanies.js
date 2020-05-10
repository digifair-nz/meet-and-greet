import * as actionTypes from "./actionTypes";

export const fetchCompaniesStart = () => {
  return {
    type: actionTypes.FETCH_COMPANIES_START,
  };
};

export const fetchCompanies = () => {
  return (dispatch) => {
    dispatch(fetchCompaniesStart());
  };
};
