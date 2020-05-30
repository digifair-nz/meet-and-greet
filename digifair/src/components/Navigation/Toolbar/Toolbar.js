import React, { Component } from "react";

import classes from "./Toolbar.module.css";
import Logo from "../../../assets/company_logos/digifair-caps-cropped-full.png";
import LogoIcon from "../../../assets/company_logos/digifair-icon-full.png";

import Backdrop from "../../UI/Backdrop/Backdrop";
import "./ToggleMenu.css";

import Aux from "../../../hoc/Auxiliary";
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

  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) {
        this.setState({
          active: false,
          menuClass: "ToggleMenu",
        });
      }
    });
  }

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

  closeMenu = () => {


  }

  


  render() {
    // If the toolbar is minimized than logo is replaced with the icon

    // To allow for more reusability of the tool bar, the controls container may vary in the number of buttons children
    // therefore different containers will require different number of buttons. This will toggle the amount of height each row gets
    // allowing the buttons to apear more uniformly expanded
    let add = classes.StudentDashboard;
    if (this.props.controlsLocation === "ChatRoom") {
      add = classes.ChatRoom;
    }

    // Toggle between an icon and a full logo for Digifair
    let logo = !this.state.active ? (
      <img
        alt="Digifair White Icon"
        className={classes.LogoIcon}
        src={LogoIcon}
      />
    ) : (
      <img alt="Digifair White logo" className={classes.Logo} src={Logo} />
    );

    // Determines width and visability of children
    let toolbarClass = classes.ToolbarMin;
    if (this.state.active) {
      toolbarClass = classes.ToolbarOpen;
    }
    return (
      <Aux>
        <header className={toolbarClass}>
          {logo}
          <div className={this.state.menuClass} onClick={this.onMenuClick} >
            <span></span>
          </div>

          <div className={classes.ControlsContainer + " " + add}>
            {/*Make this a child prop to allow for different buttons? */}
            {
              this.state.active
                ? this.props.children
                : null /* Only show nested buttons if active */
            }
          </div>
          <span className={classes.CreditsTitle}>Credits</span>
        </header>
        {/* Dim the background when the menu opens and close the menu when background is clicked*/}
        <Backdrop show={this.state.active} clicked={this.onMenuClick}/>
      </Aux>
    );
  }
}

export default Toolbar;
