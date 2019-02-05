import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  ScrollView,
  Animated,
  Dimensions,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { checkAuth } from "../../actions/auth";
import { getJobs } from "../../actions/job";
import styled from "styled-components";
import { Navigation } from "react-native-navigation";
import {
  goToChatList,
  goToSignIn,
  goToJobs
} from "../../navigation/navigation";
import AppearedCallout from "../CommonUIElements/AppearedCallout";
import { getMessages, setActiveChat } from "../../actions/chat";
import { logout } from "../../actions/auth";
import Menu from "../Menu";
import Header from "../Header";

const { width, height } = Dimensions.get("window");

interface IProps {
  chat: [];
  _id: string;
  name: string;
  chatColor: string;
  chats: object;
  menuBodyItems: object;
  width: number;
  leftIconFunction: () => void;
  rightIconFunction: () => void;
  getJobs: () => void;
  logout: () => void;
}

interface IState {
  isMenuOpen: boolean;
  animated: any;
}

class Map extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      animated: new Animated.Value(0)
    };
  }

  public componentDidMount() {
    if (this.props.auth.authenticated) {
      this.props.getJobs();
    }
  }

  public showMenu = () => {
    this.setState({ isMenuOpen: true });
    Animated.timing(this.state.animated, {
      toValue: 1,
      duration: 500
    }).start();
  };

  public closeMenu = () => {
    Animated.timing(this.state.animated, {
      toValue: 0,
      duration: 500
    }).start(() => this.setState({ isMenuOpen: false }));
  };

  public render() {
    return (
      <Wrap>
        <Menu
          width={width}
          closeMenu={this.closeMenu}
          isMenuOpen={this.state.isMenuOpen}
          animated={this.state.animated}
          menuHeaderNavigationRoot="Map"
          menuBodyItems={
            this.props.auth.token
              ? [
                  { title: "Map", handler: this.closeMenu },
                  { title: "Chatlist", handler: () => goToChatList() },
                  { title: "Jobs", handler: () => goToJobs() },
                  { title: "Logout", handler: this.props.logout }
                ]
              : [
                  { title: "Map", handler: this.closeMenu },
                  { title: "Chatlist", handler: () => goToChatList() },
                  { title: "Jobs", handler: () => goToJobs() },
                  { title: "SignIn", handler: () => goToSignIn() }
                ]
          }
        />
        <Header
          title="Map"
          leftIconFunction={this.showMenu}
          rightIconFunction={() =>
            Navigation.push("Map", {
              component: {
                name: "ProfileSettings",
                options: {
                  topBar: {
                    visible: false
                  }
                }
              }
            })
          }
          leftIconName="align-left"
          rightIconName="user"
        />
        <MapView
          showsUserLocation={true}
          followsUserLocation={true}
          showsScale={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={true}
          provider={MapView.PROVIDER_GOOGLE}
          style={{ width: "100%", height: height - 90 }}
          initialRegion={{
            latitude: 56.323318,
            longitude: 44.004773,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {this.props.job &&
            _.map(this.props.job.jobs, job => (
              <AppearedCallout
                customerName={job.customerName}
                jobAddress={job.jobAddress}
                jobCar={job.jobCar}
                jobDatetime={job.jobDatetime}
                coordinate={{
                  latitude: job.jobLocation.lat,
                  longitude: job.jobLocation.lng
                }}
              />
            ))}
        </MapView>
      </Wrap>
    );
  }
}

const mapDispatchToProps = {
  checkAuth,
  getJobs,
  logout
};

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat,
  job: state.job
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

const Wrap = styled(View)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
