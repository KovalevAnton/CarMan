import React from "react";
import _ from "lodash";
import { VirtualizedList } from 'react-native';
import styled from "styled-components";
import { Message } from "./Message";
import { WHITE_COLOR } from "../../helpers/styleConstants";

interface IProps {
  userEmail: string;
  messages: object;
  currentSelectedMessage: object;
}
export class MessagesList extends React.Component<IProps> {

  public componentDidUpdate(prevProps) {
    if (prevProps.messages.length !== this.props.messages.length) {
      this.scrollView.scrollToEnd();
    }
  }

  public MessagesItem = ({ item }) => {
    const { userEmail } = this.props
    return (<Message key={item._id} idx={item._id}
      files={item.links}
      text={item.text} isMyMessage={item.author.email === userEmail}
      timestamp={item.timestamp} />
    )
  }

  public render() {
    const { messages } = this.props
    console.log(messages)
    return (
      <VirtualizedList
        // inverted
        onScrollToIndexFailed={() => this.scrollToEnd()}
        getItem={(data, index) => data[index]}
        getItemCount={data => data.length}
        initialScrollIndex={0}
        ref={(scrollView) => { this.scrollView = scrollView }}
        style={{
          paddingRight: 20,
          paddingLeft: 20,
          display: "flex",
          flexDirection: "column",
          backgroundColor: `${WHITE_COLOR}`
        }}
        data={messages}
        renderItem={this.MessagesItem}
      />
    )
  }
}
