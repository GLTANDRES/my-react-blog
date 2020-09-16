import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  NavbarToggler,
  Button,
} from "reactstrap";

import { connect } from "react-redux";
import firebase from "../../../Config/firebase";
import { Link } from "react-router-dom";

class Heading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  componentWillReceiverPorps(nextProps, nextContext) {
    if (!nextProps.auth.isEmpty) {
      firebase
        .auth()
        .currentUser.getIdTokenResult()

        .then((claim) => {
          console.log(claim);
        });
    }
  }

  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/"> My blog</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/new-article">New Article</NavLink>
            </NavItem>
          </Nav>
          {this.props.auth.isEmpty ? "" : this.props.auth.displayName}
          <UncontrolledDropdown>
            <DropdownToggle nav caret>
              Options
            </DropdownToggle>
            <DropdownMenu right>
              {this.props.auth.isEmpty ? (
                <DropdownItem>
                  {" "}
                  <Link to={{ pathname: "/login" }}>Login</Link>
                </DropdownItem>
              ) : (
                <DropdownItem>
                  <Button onClick={() => firebase.auth().signOut()}>
                    Logout
                  </Button>
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Collapse>
      </Navbar>
    );
  }
}

const enhance = connect(({ firebase: { auth, profile } }) => ({
  auth,
  profile,
}));

export default enhance(Heading);
