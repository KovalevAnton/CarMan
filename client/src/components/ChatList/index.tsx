import React from "react";
import { ChatListItem } from "./ChatItem";
import { connect } from "react-redux";
import _ from "lodash"
import { ScrollView, Animated, Dimensions, View, RefreshControl, Text } from "react-native";
import styled from "styled-components";
import { logout } from "../../actions/auth";
import { saveChatlistTimestamp } from "../../actions/storage";
import { WHITE_COLOR, SOFT_BLUE_COLOR, BLACK_COLOR } from "../../helpers/styleConstants";
import { CHAT_LIST_TIMESTAMP } from "../../constants/storage";
import { getMessages, setActiveChat, getChats, refreshChatList } from "../../actions/chat";
import { Navigation } from "react-native-navigation";
import { goToSignIn, goToMap } from "../../navigation/navigation";
import Menu from "../Menu";
import Header from "../Header";
import selector from "./selector";

const { width } = Dimensions.get('window')
interface IProps {
  chat: [];
  getMessages: (_id) => void;
  setActiveChat: ({ chatId, name, chatColor, chatImage }) => void;
  _id: string;
  name: string;
  chatColor: string;
  chats: object;
  menuBodyItems: object;
  auth: object;
  lastChatsTimestamp: object;
  width: number;
  goHome: () => void;
  logout: () => void;
  getChats: () => void;
  refreshChatList: () => void;
  saveChatlistTimestamp: (key, data) => void;
  refreshingChatList: boolean;
}

interface IState {
  isMenuOpen: boolean;
  refreshing: boolean;
  animated: any;
  currentMenuScrollPosition: number;
}

class ChatList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      animated: new Animated.Value(0),
      currentMenuScrollPosition: 0,
      refreshing: false,
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

  public setActiveChatAndGetMessages(chatProperties) {
    this.props.setActiveChat(chatProperties)
    this.props.getMessages(chatProperties.chatId)
  }

  public render() {
    return (
      <View>
        <Menu
          width={width}
          closeMenu={this.closeMenu}
          isMenuOpen={this.state.isMenuOpen}
          animated={this.state.animated}
          menuHeaderNavigationRoot='Chatlist'
          menuBodyItems={this.props.auth.token ? [
            { title: "Map", handler: () => goToMap() },
            { title: "Chatlist", handler: this.closeMenu },
            { title: "Logout", handler: this.props.logout }]
            :
            [{ title: "Map", handler: () => goToMap() },
            { title: "Chatlist", handler: this.closeMenu },
            { title: "SignIn", handler: () => goToSignIn() }]
          }
        />
        <ChatListWrapper width={width}>
          <Header
            title="Chats"
            leftIconFunction={this.showMenu}
            leftIconName="align-left"
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.props.chat.refreshingChatList}
                onRefresh={() => this.props.refreshChatList()}
              />
            }>
            {_.map(this.props.sortedChats, chat => (
              <ChatListItem
                navigateToChat={() =>
                  Navigation.push("ChatList", {
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
                saveChatlistTimestamp={() => saveChatlistTimestamp(CHAT_LIST_TIMESTAMP, { ...this.props.chat.lastChatsTimestamp, [chat.chatId]: Date.now() })}
                name={chat.chatName}
                id={chat.chatId}
                chatImage={chat.chatImage}
                chatColor={chat.chatColor}
                lastMessageText={chat.lastMessageText}
                lastMessageAuthor={chat.lastMessageAuthor}
                lastMessageTimestamp={chat.lastMessageTimestamp}
                haveNewMessages={!!(this.props.chat.lastChatsTimestamp &&
                  chat.lastMessageTimestamp - this.props.chat.lastChatsTimestamp[chat.chatId] > 0 &&
                  chat.lastMessageAuthorId !== this.props.auth.id)}
                setActiveChatAndGetMessages={() =>
                  this.setActiveChatAndGetMessages({ chatId: chat.chatId, chatName: chat.chatName, chatColor: chat.chatColor, chatImage: chat.chatImage })}
              />
            ))}
          </ScrollView>
        </ChatListWrapper>
      </View >
    );
  }
}

const ChatListWrapper = styled(View)`
        display: flex;
        flexDirection: column;
        backgroundColor: ${WHITE_COLOR};
        borderLeftWidth: 3;
        borderColor: rgba(0,0,0,0.05);
        height: 100%;
        position: relative;
      `;

const mapStateToProps = state => selector(state)

const mapDispatchToProps = {
  getMessages,
  setActiveChat,
  logout,
  getChats,
  refreshChatList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatList);
