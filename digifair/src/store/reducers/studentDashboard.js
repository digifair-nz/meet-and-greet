import * as actionTypes from "../actions/actionTypes";

const initialState = {
  companies: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_COMPANIES_START:
      return {
        ...state,
      };
  }
};
export default reducer;