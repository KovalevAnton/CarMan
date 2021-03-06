import React from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View, Text, Animated } from "react-native";
import { Navigation } from "react-native-navigation";
import { BLACK_COLOR, WHITE_COLOR } from "../../helpers/styleConstants";
import styled from "styled-components";
import _ from "lodash";
import { Avatar } from "../Avatar";

interface IProps {
    chat: any;
    size: string;
    chatColor: string;
    name: string;
    width: string;
    menuHeaderNavigationRoot: string;
    isMenuOpen: boolean;
    menuBodyItems: object
    animated: object
    auth: object
    closeMenu: () => void
}

class Menu extends React.Component<IProps> {

    public render() {
        const { auth, menuBodyItems, menuHeaderNavigationRoot, width, closeMenu, isMenuOpen, animated } = this.props
        return (
            <Animated.View
                style={{
                    width,
                    height: '100%',
                    position: 'absolute',
                    zIndex: 20,
                    bottom: 0,
                    display: isMenuOpen ? 'flex' : 'none',
                }}
            >
                <Overlay
                    onPress={closeMenu} />
                <MenuView style={{
                    transform: [{
                        translateX: animated.interpolate(
                            {
                                inputRange: [0, 1],
                                outputRange: [-width * 0.8, 0],
                            }
                        )
                    }]
                }}>
                    <MenuHeader
                        onPress={() =>
                            Navigation.push(menuHeaderNavigationRoot, {
                                component: {
                                    name: 'ProfileSettings',
                                    options: {
                                        topBar: {
                                            visible: false
                                        },
                                    }
                                }
                            })}>
                        <AvatarWrap>
                            <Avatar
                                srcImg={auth.srcAvatar}
                                size="middle"
                                avatarColor="#996699"
                                name={auth.name} />
                        </AvatarWrap>
                        <AvatarUsername>{auth.name}</AvatarUsername>
                    </MenuHeader>
                    <MenuBody>
                        {_.map(menuBodyItems, item => (
                            <MenuItem onPress={() => item.handler()}>
                                <MenuTitle>{item.title}</MenuTitle>
                            </MenuItem>
                        ))}
                    </MenuBody>
                </MenuView >
            </Animated.View>
        );
    }
}

const Overlay = styled(TouchableOpacity)`
    top: 0;
    right: 0;
    background-color: rgba(0,0,0,0.8);
    width: 100%;
    height: 100%;
    display: flex;
  `;

const MenuView = styled(Animated.View)`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 70%;
    padding-top: 40px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${WHITE_COLOR};
`;

const MenuHeader = styled(TouchableOpacity)`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    border-bottom-width: 3;
    border-color: rgba(0,0,0,0.05);
    height: 70px;
    padding: 0 10px;
    width: 100%;
`;

const AvatarWrap = styled(View)`
    width: 70px;
    padding: 5px;
`;

const AvatarUsername = styled(Text)`
    font-size: 18;
    color: ${BLACK_COLOR};
    font-weight: 500;
`;
const MenuBody = styled(View)`
    background-color: #eee;
    display: flex;
    flex-direction: column;
    border-color: rgba(0,0,0,0.05);
    height: 100%;
`;

const MenuItem = styled(TouchableOpacity)`
    background-color: ${WHITE_COLOR};
    display: flex;
    justify-content: center;
    padding-left: 20px;
    flex-direction: column;
    border-color: rgba(0,0,0,0.05);
    height: 100px;
    border-bottom-width: 3;
`;

const MenuTitle = styled(Text)`
    font-size: 24px;
`;

const mapStateToProps = state => ({ auth: state.auth, chat: state.chat });

export default connect(
    mapStateToProps,
    null
)(Menu);
