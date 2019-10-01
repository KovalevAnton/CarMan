import {
  OUTCOMING_MESSAGE,
  GET_CHATS,
  GET_CHATS_ERROR,
  GET_MESSAGES_ERROR,
  GET_MESSAGES,
  SET_ACTIVE_CHAT,
  SEND_MESSAGE,
  FIND_USERS,
  CREATE_NEW_CHAT,
  // UPDATE_CHAT,
  // UPLOAD_START,
  // UPLOAD_PROGRESS,
  // UPLOAD_END,
  REFRESH_CHATLIST_END,
  REFRESH_CHATLIST_START,
  GET_CHATLIST_TIMESTAMP,
  ADD_PICTURE_IN_MESSAGE_LOCALY,
  DELETE_PICTURE_IN_MESSAGE_LOCALY,
  CLEAN_PICTURE_IN_MESSAGE_LOCALY
} from '../constants/actions'
import io from 'socket.io-client'
import _ from 'lodash'
// import RNFetchBlob from 'rn-fetch-blob'
import { AsyncStorage } from 'react-native'
import { doJsonAuthRequest, getToken, getRandomColor } from './helper'
import {
  BASE_URL,
  CHAT_URL,
  MESSAGE_URL,
  FIND_USERS_URL,
  UPLOAD_URL
} from './endpoinds'
import { CHAT_LIST_TIMESTAMP } from '../constants/storage'

export const sendMessage = (chatId, message) => {
  return {
    type: SEND_MESSAGE,
    payload: { chatId, message }
  }
}

export const getChatlistTimestamp = () => async dispatch => {
  try {
    const storage = await AsyncStorage.getItem(CHAT_LIST_TIMESTAMP)
    const chatlistTimestamp = JSON.parse(storage)
    dispatch({ type: GET_CHATLIST_TIMESTAMP, payload: chatlistTimestamp })
  } catch (e) {
    console.log(e)
  }
}

export const getChats = () => async dispatch => {
  dispatch(getChatlistTimestamp())
  try {
    let chats = await doJsonAuthRequest({
      url: CHAT_URL,
      method: 'get'
    })
    chats = _.map(chats, chat => ({
      ...chat,
      chatColor: getRandomColor(chat.chatId)
    }))
    dispatch({
      type: GET_CHATS,
      payload: chats
    })
    dispatch({ type: REFRESH_CHATLIST_END })
  } catch (e) {
    console.log(e)
    dispatch({ type: GET_CHATS_ERROR })
  }
}

export const getMessages = chatId => async dispatch => {
  try {
    const messages = await doJsonAuthRequest({
      url: MESSAGE_URL + chatId,
      method: 'get'
    })
    dispatch({
      type: GET_MESSAGES,
      payload: messages
    })
  } catch (e) {
    dispatch({ type: GET_MESSAGES_ERROR })
  }
}

export const setActiveChat = chat => dispatch => {
  dispatch({ type: SET_ACTIVE_CHAT, payload: chat })
}

export const createNewChat = connectedUser => async dispatch => {
  try {
    const newChat = await doJsonAuthRequest({
      url: CHAT_URL,
      method: 'post',
      data: { connectedUser }
    })
    const chatColor = getRandomColor(newChat.chatId)
    const newChatWithColorAndImage = {
      ...newChat,
      chatColor
    }
    dispatch(setActiveChat(newChatWithColorAndImage))
    dispatch({
      type: CREATE_NEW_CHAT,
      payload: newChatWithColorAndImage
    })
  } catch (e) {
    console.log('Error :' + e)
  }
}

export const refreshChatList = () => async dispatch => {
  dispatch({ type: REFRESH_CHATLIST_START })
  dispatch(getChats())
}

// export const uploadPhotoInMessage = (image) => async (dispatch) => {
//   console.log(image)
//   const token = await getToken()
//   dispatch({
//     type: UPLOAD_START,
//   })
//   RNFetchBlob.fetch('POST', UPLOAD_URL, {
//     Authorization: token,
//     // this is required, otherwise it won't be process as a multipart/form-data request
//     'Content-Type': 'multipart/form-data',
//   }, [
//       {
//         name: image.filename,
//         filename: image.filename,
//         data: RNFetchBlob.wrap(image.path),
//         type: image.mime
//       },
//     ]).uploadProgress({ interval: 50 }, (written, total) => {
//       dispatch({
//         type: UPLOAD_PROGRESS,
//         payload: written / total
//       });
//     })
//     .progress((received, total) => {
//       dispatch({
//         type: UPLOAD_END
//       });
//       dispatch({
//         type: UPLOAD_PROGRESS,
//         payload: 0
//       });
//     }).then(async (resp) => {
//       const newPicUrl = await JSON.parse(resp.data)
//       dispatch({
//         type: ADD_PICTURE_IN_MESSAGE_LOCALY,
//         payload: newPicUrl[image.filename].url
//       })
//     })
// }

export const deletePhotoInMessage = imageUrl => dispatch => {
  dispatch({
    type: DELETE_PICTURE_IN_MESSAGE_LOCALY,
    payload: imageUrl
  })
}

export const deleteAllPhotoInMessageLocaly = () => ({
  type: CLEAN_PICTURE_IN_MESSAGE_LOCALY
})
