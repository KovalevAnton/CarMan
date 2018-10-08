import {
  OUTCOMING_MESSAGE,
  GET_CHATS,
  GET_CHATS_ERROR,
  GET_MESSAGES_ERROR,
  GET_MESSAGES,
  SET_ACTIVE_CHAT,
  SEND_MESSAGE
} from "../constants/actions";
import io from "socket.io-client";
import { doJsonAuthRequest, getToken } from "./helper";
import { BASE_URL, CHAT_URL, MESSAGE_URL } from "./endpoinds";

export const sendMessage = (chatId, message) => {
  return {
    type: SEND_MESSAGE,
    payload: chatId,
    message
  };
};

export const getChats = () => async dispatch => {
  try {
    const chats = await doJsonAuthRequest({
      url: CHAT_URL,
      method: "get"
    });
    dispatch({
      type: GET_CHATS,
      payload: chats
    });
  } catch (e) {
    dispatch({ type: GET_CHATS_ERROR });
  }
};

export const getMessages = chatId => async dispatch => {
  try {
    const messages = await doJsonAuthRequest({
      url: MESSAGE_URL + chatId,
      method: "get"
    });
    dispatch({
      type: GET_MESSAGES,
      payload: messages
    });
  } catch (e) {
    dispatch({ type: GET_MESSAGES_ERROR });
  }
};

export const setActiveChat = (chatId, chatName) => ({
  type: SET_ACTIVE_CHAT,
  payload: { chatId, chatName }
});