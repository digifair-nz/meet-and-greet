import React from "react";

import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";

import classes from "./EventFinder.module.css";
const eventFinder = () => {
  /*EventFinder container is shown when the user did not authenticate and has an invalid link.
  The user must enter the event id or use the link with the event id
*/
  return (
    <div className={classes.EventFinderContainer}>
      <h1>Hi!</h1>
      <h3>Please use the link with the event ID provided by the organiser</h3>
    </div>
  );
};
export default eventFinder;
