import * as actionTypes from "./actionTypes";

export const updateQueuePosition = (companyId, queuePosition) => {
  // Expect to be called when a message is sent from the socket connection
  return {
    type: actionTypes.UPDATE_QUEUE_POSITION,
    companyId: companyId,
    queuePosition: queuePosition,
  };
};
