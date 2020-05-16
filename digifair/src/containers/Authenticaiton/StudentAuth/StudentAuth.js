import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../../store/actions/index";

import classes from "./StudentAuth.module.css";
import digifairLogo from "../../../assets/company_logos/digifair-logo-inverse.png";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
class StudentAuth extends Component {
  // REFRACTOR SO THAT OTHER COMPONENTS CAN REUSE!

  state = {
    // The state here contains the required information to produce input fields and store their values

    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false, // Refers to if the user began typing
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    invalidForm: false,
  };

  componentDidMount() {
    // Redirect the user to the root if he has authenticated
    if (this.props.authRedirectPath !== "/") {
      this.props.onSetAuthRedirectPath();
    }
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,

      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      },
    };
    this.setState({ controls: updatedControls });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    // Better ux to let them finish typing and only show on submit
    // if (rules.isEmail) {
    //   console.log("here")
    //   const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    //   isValid = pattern.test(value) && isValid;
    // }

    return isValid;
  }

  submitHandler = (event) => {
    event.preventDefault();

    if (this.state.controls.email.value === "") {
      this.setState({
        invalidForm: true,
      });
    } else {
      this.setState({
        invalidForm: false,
      });

      // Dispatch auth action
      this.props.onAuth(
        this.state.controls.email.value,
        this.state.controls.password.value
      );
    }
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        shouldValidate={formElement.config.validation}
        invalid={!formElement.config.valid}
        touched={formElement.config.touched}
      />
    ));

    let authed = null;

    // console.log(this.props.token == null);
    if (this.props.authenticated) {
      authed = <Redirect to={this.props.authRedirectPath} />;
    }

    let errorMessage = null;
    // if (this.props.error) {
    //   errorMessage = this.props.error.message;
    // }
    if (this.state.invalidForm) {
      errorMessage = "Please enter your email and password";
    }

    return (
      <div className={classes.AuthContainer}>
        {
          authed /*This causes authenticated users to be redirected to the root */
        }
        <div className={classes.FormContainer}>
          <img
            className={classes.Logo}
            src={digifairLogo}
            alt="Digifair Black and White Logo"
          />

          <form
            className={classes.Form}
            onSubmit={(event) => this.submitHandler(event)}
          >
            <h2 className={classes.FormTitle}>Sign in</h2>
            <span className={classes.ErrorMessage}>{errorMessage}</span>

            {form}
          </form>
          <Button
            clicked={(event) => this.submitHandler(event)}
            btnType="Accept"
          >
            Sign in
          </Button>
        </div>
        <div className={classes.BackgroundIllustration}></div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.studentAuth.loading,
    error: state.studentAuth.error,
    authenticated: state.studentAuth.token != null,
    authRedirectPath: state.studentAuth.authRedirectPath,
    token: state.studentAuth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(actions.studentAuth(email, password)),
    onSetAuthRedirectPath: () =>
      dispatch(actions.setStudentAuthRedirectPath("/")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentAuth);
