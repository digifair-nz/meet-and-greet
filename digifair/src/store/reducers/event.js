import * as actionTypes from "../actions/actionTypes";

import { updateObject } from "../utility";

/*

This reducer is responsible for the event slice of the state 
which includes the companies that the student sees and can queue too

It contains information necessary to display the event name 
and display the event timer (when the event expires)


*/
const initialState = {
  eventName: null,
  expirationDate: null,
};

const fetchEvent = (state, action) => {
  return updateObject(state, {
    eventName: action.eventName,
    expirationDate: action.expirationDate,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EVENT:
      return fetchEvent(state, action);
    default:
      return state;
  }
};
export default reducer;
