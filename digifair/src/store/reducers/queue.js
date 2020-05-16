// import * as actionTypes from "../actions/actionTypes";

// import { updateObject } from "../utility";
// const initialState = {
//   /// REFRACTOR FOR IS QUEUED
// };

// // Queue
// const updateCompanyQueuing = (state, companyId, queueStatus) => {
//   // Returns an updated company queue status
//   let updatedCompanies = [...state.companies]; // shallow copy of the state array

//   let updatedCompany = { ...updatedCompanies[companyId] }; // copy of the state object

//   updatedCompany.queuing = queueStatus;

//   updatedCompanies[companyId] = updatedCompany;

//   return updatedCompanies;
// };

// const queueInit = (state, action) => {
//   let updatedCompanies = updateCompanyQueuing(state, action.companyId, true);

//   return updateObject(state, { companies: updatedCompanies });
// };

// const queueSuccess = (state, action) => {
//   // Update the company queuing status to false on finished action of the action
//   let updatedCompanies = [...state.companies];

//   let updatedCompany = { ...updatedCompanies[action.companyId] };

//   updatedCompany.isQueued = true;
//   updatedCompany.queuing = false;
//   updatedCompanies[action.companyId] = updatedCompany;

//   return updateObject(state, { companies: updatedCompanies });
// };

// const queueFail = (state, action) => {
//   let updatedCompanies = updateCompanyQueuing(state, action.companyId, false);

//   return updateObject(state, { companies: updatedCompanies });
// };

// const dequeueInit = (state, action) => {
//   let updatedCompanies = updateCompanyQueuing(state, action.companyId, true);

//   return updateObject(state, { companies: updatedCompanies });
// };

// // DEQUEUE
// const dequeueSuccess = (state, action) => {
//   let updatedCompanies = [...state.companies];

//   let updatedCompany = { ...updatedCompanies[action.companyId] };

//   updatedCompany.isQueued = false;
//   updatedCompany.queuing = false;

//   updatedCompanies[action.companyId] = updatedCompany;

//   return updateObject(state, { companies: updatedCompanies });
// };

// const dequeueFail = (state, action) => {
//   let updatedCompanies = updateCompanyQueuing(state, action.companyId, false);
//   return updateObject(state, { companies: updatedCompanies });
// };

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     //refractor
//     case actionTypes.FETCH_COMPANIES_START:
//       //
//       return state;

//     case actionTypes.QUEUE_INIT:
//       return queueInit(state, action);
//     case actionTypes.QUEUE_SUCCESS:
//       return queueSuccess(state, action);
//     case actionTypes.QUEUE_FAIL:
//       return queueFail(state, action);
//     case actionTypes.DEQUEUE_INIT:
//       return dequeueInit(state, action);
//     case actionTypes.DEQUEUE_SUCCESS:
//       return dequeueSuccess(state, action);
//     case actionTypes.DEQUEUE_FAIL:
//       return dequeueFail(state, action);
//     default:
//       return state;
//   }
// };
// export default reducer;
