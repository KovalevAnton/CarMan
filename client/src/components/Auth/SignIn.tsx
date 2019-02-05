import React from "react";
import { connect } from "react-redux";
import {
  Dimensions,
  Animated,
  Easing,
  KeyboardAvoidingView,
} from "react-native";
import { goToMap, goToChatList } from "../../navigation/navigation";
import { login } from "../../actions/auth";
import Menu from '../Menu'
import Header from '../Header'
import Input from "../CommonUIElements/Input";
import Button from "../CommonUIElements/Button";
import Link from "../CommonUIElements/Link";
import { Navigation } from "react-native-navigation";
import {
  Title,
  Annotation,
  Body,
  LoginErrorNotification
} from "./styled";

const { width } = Dimensions.get("window");

interface IProps {
  login: ({ email, password }) => void;
  auth: { authError: any };
  componentId: string;
}

interface IState {
  xPosition: Animated.AnimatedValue;
  password: string;
  email: string;
  error: { email: string; password: string };
  isMenuOpen: boolean;
  animated: any;
}
class SignIn extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      xPosition: new Animated.Value(300),
      password: "",
      email: "",
      error: { email: "", password: "" },
      isMenuOpen: false,
      animated: new Animated.Value(0)
    };
  }

  public showMenu = () => {
    this.setState({ isMenuOpen: true })
    Animated.timing(this.state.animated, {
      toValue: 1,
      duration: 500,
    }).start();
  };

  public closeMenu = () => {
    Animated.timing(this.state.animated, {
      toValue: 0,
      duration: 500,
    }).start(() => this.setState({ isMenuOpen: false }));
  };

  public render() {
    return (
      <Animated.View
        style={{ width, transform: [{ translateX: this.state.xPosition }] }}
      >
        <Menu
          width={width}
          closeMenu={this.closeMenu}
          isMenuOpen={this.state.isMenuOpen}
          animated={this.state.animated}
          menuHeaderNavigationRoot='SignIn'
          menuBodyItems={
            [{ title: "Map", handler: () => goToMap() },
            { title: "Chatlist", handler: () => goToChatList() },
            { title: "SignIn", handler: this.closeMenu }]
          }
        />
        <KeyboardAvoidingView behavior="padding">
          <Header
            title="Sign In"
            width={width}
            leftIconName="align-left"
            leftIconFunction={() => this.showMenu()}
          />
          <Body>
            <Title>SIGN IN</Title>
            <Annotation style={{ marginBottom: 10 }}>CarMan</Annotation>
            <Input
              placeholder="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              error={this.state.error.email}
              textContentType="email"
            />
            <Input
              placeholder="Password"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              error={this.state.error.password}
              type="password"
              textContentType="password"
              secureTextEntry={true}
            />
            <LoginErrorNotification>
              {this.props.auth.authError}
            </LoginErrorNotification>
            <Button
              onPress={() => this.handleLogin()}
              disabled={!this.allFieldsFilled()}
            >
              Sign In
            </Button>
            <Link
              color="#000"
              onPress={() => {
                Navigation.push("SignIn", {
                  component: {
                    name: "SignUp"
                  }
                });
              }}
              title="Sign Up"
            />
            <Link
              color="#000"
              onPress={() => {
                Navigation.push("SignIn", {
                  component: {
                    name: "ForgotPassword"
                  }
                });
              }}
              title="Forgot Password"
            />
          </Body>
        </KeyboardAvoidingView>
      </Animated.View >
    );
  }

  public componentDidMount() {
    Animated.timing(this.state.xPosition, {
      toValue: 0,
      easing: Easing.back(0),
      duration: 200
    }).start();
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.auth.authenticated) {
      goToMap();
    }
  }

  public allFieldsFilled() {
    return this.state.email.length > 2 && this.state.password.length > 7;
  }

  private handleLogin() {
    const { email, password } = this.state;
    if (this.allFieldsFilled()) {
      this.setState({ error: { email: "", password: "" } });
      this.props.login({
        email,
        password
      });
    }
  }
}

const mapDispatchToProps = {
  login
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
