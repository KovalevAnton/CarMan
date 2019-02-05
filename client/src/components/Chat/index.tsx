import React from "react";
import { connect } from "react-redux";
import { KeyboardAvoidingView, Dimensions, View } from "react-native";
import styled from "styled-components";
import Header from "../Header";
import { Navigation } from "react-native-navigation";
import MessageInput from "./MessageInput";
import { MessagesList } from "./MessagesList";
import { goToSignIn, goToMap } from "../../navigation/navigation";
import { WHITE_COLOR } from "../../helpers/styleConstants";
import { sendMessage, unsetActiveChat, getChatlistTimestamp } from "../../actions/chat";
import _ from "lodash";

const { height } = Dimensions.get('window') // it's for IphoneX
interface IProps {
  chat: any;
  auth: any;
  sendMessage: (chatId, text) => void;
  unsetActiveChat: () => void;
  getChatlistTimestamp: () => void;
  chatId: string;
  chatName: string;
  chatImage: string | undefined;
  width: string;
  chatColor: string;
  messages: any;
  messagesByUserId: object;
}
class Chat extends React.PureComponent<IProps> {
  constructor(props) {
    super(props)
  }

  public render() {
    const { chat, width, auth, messages } = this.props;
    return (
      <ChatView style={{ width: width }}>
        <Header
          chatImage={chat.activeChat.chatImage}
          title={chat.activeChat.chatName}
          subTitle="Last seen recently"
          width={width}
          isAvatarVisible={true}
          leftIconFunction={() => {
            this.props.getChatlistTimestamp()
            this.props.unsetActiveChat()
            Navigation.popToRoot("ChatList")
          }}
          chatColor={chat.activeChat.chatColor}
          leftIconName="arrow-left" />
        <MessagesList messages={messages} userEmail={auth.email} />
        <MessageInput
          handleSendMessage={(message) => this.props.sendMessage(chat.activeChat.chatId, message)}
        />
      </ChatView>
    );
  }
}

const ChatView = styled(KeyboardAvoidingView).attrs({
  behavior: "padding"
})`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const mapDispatchToProps = {
  sendMessage,
  unsetActiveChat,
  getChatlistTimestamp
};

const selector = (state) => {
  const messages = _.get(state, `messages[${state.chat.activeChat.chatId}]`, []);
  return ({ auth: state.auth, chat: state.chat, messages });
}
const mapStateToProps = state => selector(state);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
