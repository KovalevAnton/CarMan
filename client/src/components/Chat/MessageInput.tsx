import React from "react";
import { connect } from "react-redux";
import { View, TextInput, Image, Dimensions, ScrollView } from "react-native";
import _ from 'lodash'
import { SOFT_BLUE_COLOR, WHITE_COLOR } from "../../helpers/styleConstants";
import Icon from 'react-native-vector-icons/FontAwesome5';
// import ImagePicker from 'react-native-image-crop-picker';
import styled from "styled-components";
// import * as Progress from 'react-native-progress';
// import { uploadPhotoInMessage, deletePhotoInMessage, deleteAllPhotoInMessageLocaly } from '../../actions/chat'

const { height } = Dimensions.get('window') // it's for IphoneX

interface IProps {
  handleSendMessage: (textInput) => void;
  // uploadPhotoInMessage: (imageUrl) => void;
  // deletePhotoInMessage: (imageUrl) => void;
  // deleteAllPhotoInMessageLocaly: () => void;
  chatId: string;
  // imagesInCurrentMessage: object;
  chat: object;
}
interface IState {
  textInput: string;
}
class MessageInput extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      textInput: ""
    };
    this.handleSending = this.handleSending.bind(this);
  }

  public handleSending(message) {
    this.props.handleSendMessage(message);
    // this.props.deleteAllPhotoInMessageLocaly();
    this.setState({ textInput: "" });
  }

  // public getPhotos = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true
  //   }).then(image => {
  //     this.props.uploadPhotoInMessage(image)
  //   }
  //   );
  // }

  public render() {
    const { textInput } = this.state
    const { chat } = this.props
    return (
      <MessageInputView>
        <Icon
          style={{ marginLeft: 12, marginRight: 12 }}
          size={22}
          name="microphone"
          backgroundColor={WHITE_COLOR}
          color="#f5775f" />
        <View style={{ flex: 4 }}>
          <TextInput
            onSubmitEditing={() => this.handleSending({text: textInput, links: chat.imagesInCurrentMessage })}
            onChangeText={text => {
              this.setState({ textInput: text });
            }}
            value={textInput}
            returnKeyType="send"
            returnKeyLabel="Send"
            placeholder="Your message"
            style={{ backgroundColor: "transparent", fontSize: 18, margin: 0, }}
          />
        </View>
        <Icon
          size={22}
          name="grin"
          backgroundColor={WHITE_COLOR}
          color={SOFT_BLUE_COLOR} />
        <Icon
          // onPress={() => {
          //   this.getPhotos()
          // }}
          style={{ marginLeft: 12, marginRight: 12 }}
          size={22}
          name="paperclip"
          color={SOFT_BLUE_COLOR} />
        {/* <UploadPhotoWrap horizontal={true}>
          {_.map(chat.imagesInCurrentMessage, imageUrl => (
            <MessageImageWrap>
              <MessageImage
                source={{ uri: imageUrl }}
              />
              <CloseIcon
                onPress={() => {
                  this.props.deletePhotoInMessage(imageUrl)
                }}
                solid
                size={22}
                name="times-circle"
                backgroundColor={WHITE_COLOR}
                color={SOFT_BLUE_COLOR} />
            </MessageImageWrap>
          ))
          }
          {chat.uploadingPhotoInChat && <MessageImageProgress>
            {chat.uploadingPhotoInChatProgress === 0 && <Progress.Circle color={SOFT_BLUE_COLOR} size={50} indeterminate={true} />}
            {chat.uploadingPhotoInChatProgress !== 0 && <Progress.Pie color={SOFT_BLUE_COLOR} progress={chat.uploadingPhotoInChatProgress} size={50} />}
          </MessageImageProgress>}
        </UploadPhotoWrap> */}
      </MessageInputView>
    );
  }
}

const mapDispatchToProps = {
  // uploadPhotoInMessage,
  // deletePhotoInMessage,
  // deleteAllPhotoInMessageLocaly
};

const mapStateToProps = state => ({ auth: state.auth, chat: state.chat });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageInput);


const MessageInputView = styled(View)`
    flex-direction: row;
    padding: 4px;
    margin: 10px;
    margin-bottom: ${height > 800 ? "30px" : "10px"};
    align-items: center;
    justify-content: center;
    border-width: 1;
    border-color: #888;
    background-color: #d6efef;
    border-radius: 5px;
    border-color: ${WHITE_COLOR};
    min-height: 50px;
    `;

// const MessageImage = styled(Image)`
//     overflow: hidden; 
//     width: 130; 
//     height: 80; 
//     border-width: 0.5; 
//     border-radius: 10;
//     margin-bottom: 5; 
//     margin-top: 10; 
//     margin-right: 10; 
//     background-color: ${WHITE_COLOR}; 
//     border-color: ${SOFT_BLUE_COLOR};
//     `;

const UploadPhotoWrap = styled(ScrollView)`
    flex-direction: row;
    position: absolute; 
    bottom: 50; 
    right: 0;
    width: 100%;
    `;

// const MessageImageProgress = styled(View)`
//       overflow: hidden; 
//       width: 130; 
//       height: 80;
//       border-width: 0.5;
//       border-radius: 10;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin-bottom: 5; 
//       margin-top: 10;
//       margin-right: 10; 
//       background-color: ${WHITE_COLOR};
//       border-color: ${SOFT_BLUE_COLOR}
//       `;

// const MessageImageWrap = styled(View)``;

// const CloseIcon = styled(Icon)`
//       overflow: hidden;
//       backgroundColor: ${WHITE_COLOR};
//       borderRadius: 11; 
//       top: 0; 
//       right: 0; 
//       position: absolute
//       `;