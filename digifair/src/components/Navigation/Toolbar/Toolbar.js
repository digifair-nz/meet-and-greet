import React, { Component } from "react";

import classes from "./Toolbar.module.css";
import Logo from "../../../assets/company_logos/digifair-white.png";
import LogoIcon from "../../../assets/company_logos/digifair_icon_notification.png";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

import "./ToggleMenu.css";

class Toolbar extends Component {
  state = {
    minimized: true,
    menuClass: "ToggleMenu",
    active: false,
  };
  onMenuClick = () => {
    let className = "ToggleMenu";

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
    let logo = this.state.minimized ? (
      <img
        alt="Digifair White Icon"
        className={classes.LogoIcon}
        src={LogoIcon}
      />
    ) : (
      <img alt="Digifair White logo" className={classes.Logo} src={Logo} />
    );

    return (
      <header className={classes.Toolbar}>
        <DrawerToggle clicked={this.props.drawerToggleClicked} />
        <div className={classes.LogoContainer}>{logo}</div>
        <div className={this.state.menuClass} onClick={this.onMenuClick}>
          <span></span>
        </div>

        <nav className={classes.DesktopOnly}>
          {/*Make this a child prop to allow for different buttons? */}
          {
            this.state.active
              ? this.props.children
              : null /* Only show nested buttons if active */
          }
        </nav>
        <span className={classes.CreditsTitle}>Credits</span>
      </header>
    );
  }
}

export default Toolbar;
