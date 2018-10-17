import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { ScrollView, Animated, Dimensions, View, StatusBar, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { checkAuth } from "../../actions/auth";
import styled from "styled-components";
import { Navigation } from "react-native-navigation";
import { getMessages, setActiveChat } from "../../actions/chat";
import { logout } from "../../actions/auth";
import ChatMenu from "../ChatMenu";
import Header from "../Header";


const { width, height } = Dimensions.get('window')

interface IProps {
    chat: [];
    _id: string;
    name: string;
    chatColor: string;
    chats: object;
    chatMenuItems: object;
    width: number;
    leftIconFunction: () => void;
    rightIconFunction: () => void;
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
            animated: new Animated.Value(0),
        };
    }

    public showChatMenu = () => {
        this.setState({ isMenuOpen: true })
        Animated.timing(this.state.animated, {
            toValue: 1,
            duration: 500,
        }).start();
    };

    public closeChatMenu = () => {
        Animated.timing(this.state.animated, {
            toValue: 0,
            duration: 500,
        }).start(() => this.setState({ isMenuOpen: false }));
    };

    public render() {
        return (
            <Wrap>
                <ChatMenu
                    width={width}
                    closeMenu={this.closeChatMenu}
                    isMenuOpen={this.state.isMenuOpen}
                    animated={this.state.animated}
                    chatMenuItems={[{ title: "Chats", handler: this.closeChatMenu }, { title: "Logout", handler: this.props.logout }]}
                />
                <Header
                    title="Chats"
                    leftIconFunction={this.showChatMenu}
                    rightIconFunction={() =>
                        Navigation.push("Map", {
                            component: {
                                name: 'ProfileSettings',
                                options: {
                                    topBar: {
                                        visible: false
                                    },
                                }
                            }
                        })}
                    leftIconName="align-left"
                    rightIconName="user" />
                <MapView
                    provider={MapView.PROVIDER_GOOGLE}
                    style={{ width: '100%', height: height - 90 }}
                    initialRegion={{
                        latitude: 56.323318,
                        longitude: 44.004773,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </Wrap>
        );
    }
}

const mapDispatchToProps = {
    checkAuth,
    logout
};

const mapStateToProps = state => ({ auth: state.auth, chat: state.chat });

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
