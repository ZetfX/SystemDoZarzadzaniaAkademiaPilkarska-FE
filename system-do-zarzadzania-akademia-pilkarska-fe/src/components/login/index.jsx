import React from "react";
import "../../App.scss";
import Login from "./login";
import Register from "./register";
import AuthService from "../../services/authService";


class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true,
    };
  }

  componentDidMount() {
    this.topSide.classList.add("top");
    {
      this.setState({
        isLogginActive: true,
      });
    }
  }

  logOut() {
    AuthService.logOut();
  }

  changeState() {
    this.topSide.classList.remove("top");
    this.topSide.classList.add("topTransition");
    setTimeout(() => this.topSide.classList.add("top"), 400);
    setTimeout(() => this.topSide.classList.remove("topTransition"), 400);
    this.setState((prevState) => ({
      isLogginActive: !prevState.isLogginActive,
    }));
  }
  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Zarejestruj się" : "Zaloguj się";
    const currentActive = isLogginActive ? "zaloguj się" : "zarejestruj się";
    return (
      <div className="master-container">
        <div className="form-container">
          <div className="container" ref={(ref) => (this.container = ref)}>
            {isLogginActive && (
              <Login containerRef={(ref) => (this.current = ref)} />
            )}
            {!isLogginActive && (
              <Register containerRef={(ref) => (this.current = ref)} />
            )}
          </div>
          <TopSide
            current={current}
            currentActive={currentActive}
            containerRef={(ref) => (this.topSide = ref)}
            onClick={this.changeState.bind(this)}
          />
        </div>
      </div>
    );
  }
}

const TopSide = (props) => {
  return (
    <div className="top-side" ref={props.containerRef} onClick={props.onClick}>
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};
export default LoginRegister;
