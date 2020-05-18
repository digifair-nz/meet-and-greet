import React, { Component } from "react";

import classes from "./Toolbar.module.css";
import Logo from "../../../assets/company_logos/digifair-white.png";
import LogoIcon from "../../../assets/company_logos/digifair_icon_notification.png";

import "./ToggleMenu.css";

class Toolbar extends Component {
  /*
  Toolbar is a menu component that will encapsulate control buttons such as Queue to All, 
  Dequeue from All (StudentDashboard) alongside with Open Queue and Invite next User (CompanyChatRoom)

  When minimized it will only show the Digifair icon, the hamburger menu and the credits link
  When opened it will show the children prop buttons, full Digifair logo and the menu will transform into an arrow

  Author: Michael Shaimerden (michael@tadesign.co.nz)

  */
  state = {
    minimized: true, // Refers to the toolbar
    menuClass: "ToggleMenu",
    active: false, // When the menu is clicked
  };

  // Refractor toggle button
  onMenuClick = () => {
    let className = "ToggleMenu";

    // This class causes the menu to transform into an arrow
    if (!this.state.active) {
      className = "ToggleMenu ActiveMenu";
    }
    this.setState({
      menuClass: className,
      active: !this.state.active,
    });
  };
  render() {
    // If the toolbar is minimized than logo is replaced with the icon
    let logo = !this.state.active ? (
      <img
        alt="Digifair White Icon"
        className={classes.LogoIcon}
        src={LogoIcon}
      />
    ) : (
      <img alt="Digifair White logo" className={classes.Logo} src={Logo} />
    );

    let toolbarClass = classes.ToolbarMin;
    if (this.state.active) {
      toolbarClass = classes.ToolbarOpen;
    }
    return (
      <header className={toolbarClass}>
        {logo}
        <div className={this.state.menuClass} onClick={this.onMenuClick}>
          <span></span>
        </div>

        <div className={classes.ControlsContainer}>
          {/*Make this a child prop to allow for different buttons? */}
          {
            this.state.active
              ? this.props.children
              : null /* Only show nested buttons if active */
          }
        </div>
        <span className={classes.CreditsTitle}>Credits</span>
      </header>
    );
  }
}

export default Toolbar;
