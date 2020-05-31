import * as actionTypes from "./actionTypes";
import axios from "../../axios-instance";

export const fetchCompaniesStart = () => {
  return {
    type: actionTypes.FETCH_COMPANIES_START,
  };
};

export const fetchCompaniesFail = (error) => {
  return {
    type: actionTypes.FETCH_COMPANIES_FAIL,
    error: error,
  };
};

export const fetchCompaniesSuccess = (fetchedCompanies) => {
  return {
    type: actionTypes.FETCH_COMPANIES_SUCCESS,
    companies: fetchedCompanies,
  };
};
export const fetchCompanies = () => {
  return (dispatch) => {
    dispatch(fetchCompaniesStart());
    const token = localStorage.getItem("token");

    axios
      .get("/user/", { headers: { "auth-token": token } })
      .then((response) => {
        dispatch(fetchCompaniesSuccess(response.data));
      })
      .catch((err) => {
        console.log(err);

        dispatch(fetchCompaniesFail("Companies could not be fetched."));
      });
  };
};
