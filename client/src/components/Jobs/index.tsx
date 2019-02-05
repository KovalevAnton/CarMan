import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  ScrollView,
  Animated,
  Dimensions,
  View,
  RefreshControl,
  Text,
  TabBarIOS
} from "react-native";
import styled from "styled-components";
import {
  WHITE_COLOR,
  SOFT_BLUE_COLOR,
  BLACK_COLOR
} from "../../helpers/styleConstants";
import Icon from "react-native-vector-icons/FontAwesome5";
import { logout } from "../../actions/auth";
import { Navigation } from "react-native-navigation";
import { goToSignIn, goToMap, goToChatList } from "../../navigation/navigation";
import selector from "./selector";
import { getJobs } from "../../actions/job";
import Button from "../CommonUIElements/Button";
import Menu from "../Menu";
import Header from "../Header";

const { width } = Dimensions.get("window");
interface IProps {
  logout: () => void;
  getJobs: () => void;
  auth: object;
}

interface IState {
  isMenuOpen: boolean;
  refreshing: boolean;
  isAddJobButtonVisible: boolean;
  animated: any;
  currentMenuScrollPosition: number;
  selectedTab: string;
}

class Jobs extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      animated: new Animated.Value(0),
      currentMenuScrollPosition: 0,
      refreshing: false,
      isAddJobButtonVisible: true,
      selectedTab: "active"
    };
  }

  public componentDidMount() {
    this.props.getJobs();
  }

  public renderActiveJobs = () => {
    return (
      <ScrollView>
        {_.map(this.props.job.jobs, job => (
          <View style={{ borderWidth: 1 }}>
            <Text>{job.customerName}</Text>
            <Text>{job.jobAddress}</Text>
            <Text>{job.jobDatetime}</Text>
            <Text>{job.jobCar}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  public renderClosedJobs = () => {
    return (
      <View>
        <Text>CLOSED!</Text>
      </View>
    );
  };

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
      <View style={{ height: "100%" }}>
        <Menu
          width={width}
          closeMenu={this.closeMenu}
          isMenuOpen={this.state.isMenuOpen}
          animated={this.state.animated}
          menuHeaderNavigationRoot="Jobs"
          menuBodyItems={
            this.props.auth.token
              ? [
                  { title: "Map", handler: () => goToMap() },
                  { title: "Chatlist", handler: () => goToChatList() },
                  { title: "Jobs", handler: this.closeMenu },
                  { title: "Logout", handler: this.props.logout }
                ]
              : [
                  { title: "Map", handler: () => goToMap() },
                  { title: "Chatlist", handler: () => goToChatList() },
                  { title: "Jobs", handler: this.closeMenu },
                  { title: "SignIn", handler: () => goToSignIn() }
                ]
          }
        />
        <JobsWrapper width={width}>
          <Header
            title="Jobs"
            leftIconFunction={this.showMenu}
            leftIconName="align-left"
            rightIconName="plus"
            rightIconFunction={() =>
              Navigation.push("Jobs", {
                component: {
                  id: "AddJob",
                  name: "AddJob",
                  options: {
                    topBar: {
                      visible: false
                    }
                  }
                }
              })
            }
          />
          <ScrollView
          // refreshControl={
          //     <RefreshControl
          //         refreshing={this.props.jobs.refreshingJobs}
          //         onRefresh={() => this.props.refreshJobs()}
          //     />
          // }
          >
            {/* {_.map(this.props.sortedJobs, chat => (
                            <JobsItem
                                navigateToChat={() =>
                                    Navigation.push("Jobs", {
                                        component: {
                                            id: 'Chat',
                                            name: 'Chat',
                                            options: {
                                                topBar: {
                                                    visible: false
                                                },
                                            }
                                        }
                                    })}
                                />
                        ))} */}
          </ScrollView>
        </JobsWrapper>
        <TabBarIOS
          // style={{ zIndex: 30 }}
          tintColor={BLACK_COLOR}
          unselectedTintColor={WHITE_COLOR}
          barTintColor={SOFT_BLUE_COLOR}
        >
          <Icon.TabBarItemIOS
            iconColor={WHITE_COLOR}
            iconName={"home"}
            iconSize={20}
            renderAsOriginal
            selectedIconColor={BLACK_COLOR}
            onPress={() => {
              this.setState({ selectedTab: "active" });
            }}
            selected={this.state.selectedTab === "active"}
            title={"ACTIVE"}
          >
            {this.renderActiveJobs()}
          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            iconColor={WHITE_COLOR}
            selectedIconColor={BLACK_COLOR}
            iconName={"home"}
            iconSize={20}
            renderAsOriginal
            onPress={() => {
              this.setState({ selectedTab: "closed" });
            }}
            selected={this.state.selectedTab === "closed"}
            title={"CLOSED"}
          >
            {this.renderClosedJobs()}
          </Icon.TabBarItemIOS>
        </TabBarIOS>
      </View>
    );
  }
}

const JobsWrapper = styled(View)`
  display: flex;
  flex-direction: column;
  background-color: ${WHITE_COLOR};
  border-left-width: 3;
  border-color: rgba(0, 0, 0, 0.05);
  /* height: 100%; */
  position: relative;
`;

const mapStateToProps = state => selector(state);

const mapDispatchToProps = {
  getJobs,
  logout
  //   refreshJobs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Jobs);
