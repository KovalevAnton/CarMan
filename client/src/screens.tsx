import React from "react";
import { Provider } from "react-redux";
import { AppState } from 'react-native';
import App from "./components/App";
import Welcome from "./components/WelcomeScreen";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import configureStore from "./store/configureStore";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Chat from "./components/Chat";
import ChatList from "./components/ChatList";
import Map from "./components/Map";
import Jobs from "./components/Jobs";
import AddJob from "./components/AddJob";
import ProfileSettings from "./components/ProfileSettings";
import { FOREGROUND, BACKGROUND, INACTIVE } from "./constants/appState";

const store = configureStore({});

const handleAppStateChange = (nextAppState) => {
  switch (nextAppState) {
    case 'active':
      store.dispatch({ type: FOREGROUND })
      break;
    case 'background':
      store.dispatch({ type: BACKGROUND })
      break;
    case 'inactive':
      store.dispatch({ type: INACTIVE });
      break;
    default:
      return;
  }
};

AppState.addEventListener('change', handleAppStateChange);

export function registerScreens(Navigation) {
  Navigation.registerComponent("carMan", () => () => (
    <Provider store={store}>
      <App />
    </Provider>
  ));
  Navigation.registerComponent("Welcome", () => () => (
    <Provider store={store}>
      <Welcome />
    </Provider>
  ));
  Navigation.registerComponent("SignIn", () => () => (
    <Provider store={store}>
      <SignIn />
    </Provider>
  ));
  Navigation.registerComponent("SignUp", () => () => (
    <Provider store={store}>
      <SignUp />
    </Provider>
  ));
  Navigation.registerComponent("ForgotPassword", () => () => (
    <Provider store={store}>
      <ForgotPassword />
    </Provider>
  ));
  Navigation.registerComponent("Chat", () => () => (
    <Provider store={store}>
      <Chat />
    </Provider>
  ));
  Navigation.registerComponent("ChatList", () => () => (
    <Provider store={store}>
      <ChatList />
    </Provider>
  ));
  Navigation.registerComponent("Map", () => () => (
    <Provider store={store}>
      <Map />
    </Provider>
  ));
  Navigation.registerComponent("ProfileSettings", () => () => (
    <Provider store={store}>
      <ProfileSettings />
    </Provider>
  ));
  Navigation.registerComponent("Jobs", () => () => (
    <Provider store={store}>
      <Jobs />
    </Provider>
  ));
  Navigation.registerComponent("AddJob", () => () => (
    <Provider store={store}>
      <AddJob />
    </Provider>
  ));
}
