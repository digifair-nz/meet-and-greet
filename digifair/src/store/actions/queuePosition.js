import * as actionTypes from "./actionTypes";
/**
 * initialize queue to a specific comapny
 * @param {string} companyId
 * @param {int} queuePosition the current position of the student in the specific company's queue
 *
 */
export const updateQueuePosition = (companyId, queuePosition) => {
  // Expect to be called when a message is sent from the socket connection
  return {
    type: actionTypes.UPDATE_QUEUE_POSITION,
    companyId: companyId,
    queuePosition: queuePosition,
  };
};
