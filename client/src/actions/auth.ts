import {
  AUTH_USER,
  DEAUTH_USER,
  AUTH_ERROR,
  SIGN_UP_USER,
  REMIND_PASSWORD,
  REMIND_PASSWORD_ERROR,
  CHANGE_PASSWORD,
  SIGN_UP_ERROR,
  CHANGE_USER_SETTINGS
  // UPLOAD_USER_PHOTO_START,
  // UPLOAD_USER_PHOTO_PROGRESS,
  // UPLOAD_USER_PHOTO_END,
} from '../constants/actions'
// import RNFetchBlob from 'rn-fetch-blob'
import { setAuth, doJsonRequest, doJsonAuthRequest, getToken } from './helper'
import {
  AUTH_URL,
  // AUTH_SOCIAL_URL,
  SIGN_UP_URL,
  REMIND_PASSWORD_URL,
  AUTH_CHECK_URL,
  CHANGE_USER_SETTINGS_URL
  // UPLOAD_URL,
} from './endpoinds'
import { AsyncStorage, Platform } from 'react-native'
import { AUTH } from '../constants/storage'
import { goToMap, goToSignIn, goWelcome } from '../navigation/navigation'
// import { AccessToken, LoginManager } from 'react-native-fbsdk';
// import firebase from 'react-native-firebase';
// import {  } from 'react-native'
// import Config from 'react-native-config'

export const checkAuth = () => async dispatch => {
  const storage = await AsyncStorage.getItem(AUTH)
  const auth = JSON.parse(storage)
  if (auth && auth.token) {
    try {
      const resp = await doJsonRequest({
        url: AUTH_CHECK_URL,
        method: 'post',
        headers: { authorization: auth.token }
      })
      const { token, user } = resp
      dispatch({
        type: AUTH_USER,
        payload: {
          token,
          name: user.name,
          email: user.email,
          srcAvatar: user.srcAvatar,
          id: user._id,
          role: user.role
        }
      })
      goToMap()
    } catch (err) {
      dispatch(setAuthError('Enter login and password'))
      goWelcome()
    }
  } else {
    goWelcome()
  }
}

export const setAuthError = error => dispatch => {
  return dispatch({ type: AUTH_ERROR, payload: error })
}

export const setSignUpError = error => ({
  type: SIGN_UP_ERROR,
  payload: error
})

export const setRemindPasswordError = error => ({
  type: REMIND_PASSWORD_ERROR,
  payload: error
})

export const login = ({ email, password }) => async dispatch => {
  try {
    const resp = await doJsonRequest({
      url: AUTH_URL,
      method: 'post',
      data: { email, password }
    })
    setAuth({ token: resp.token, userId: resp.user._id })
    return dispatch({
      type: AUTH_USER,
      payload: {
        token: resp.token,
        name: resp.user.name,
        email,
        srcAvatar: resp.user.srcAvatar,
        role: resp.user.role
      }
    })
  } catch (e) {
    console.log(e)
    dispatch(setAuthError('Incorrect username or password'))
  }
}

export const logout = () => dispatch => {
  setAuth({ token: '', userId: '' })
  dispatch({ type: DEAUTH_USER })
  goToMap()
}

export const signUp = ({ name, email, password, role }) => async dispatch => {
  try {
    const resp = await doJsonRequest({
      url: SIGN_UP_URL,
      method: 'POST',
      data: { name, email, password, role }
    })
    setAuth({ token: resp.token, userId: resp.user._id })
    dispatch({
      type: SIGN_UP_USER,
      payload: {
        role: resp.user.role,
        token: resp.token,
        id: resp.user._id,
        name: resp.user.name,
        email: resp.user.email
      }
    })
    goToMap()
  } catch (e) {
    dispatch(setSignUpError('Incorrect username or password'))
  }
}

export const remindPassword = email => async (dispatch, getStore) => {
  try {
    await doJsonAuthRequest({
      url: REMIND_PASSWORD_URL,
      method: 'post',
      data: { email }
    })
    dispatch({
      type: REMIND_PASSWORD,
      payload: email
    })
    goToSignIn()
  } catch (e) {
    dispatch(setRemindPasswordError('No such email registered, try again'))
  }
}

export const changePassword = ({ password, oldPassword }) => ({
  type: CHANGE_PASSWORD,
  payload: { password, oldPassword }
})

export const saveProfileSettings = ({
  name,
  email,
  srcAvatar
}) => async dispatch => {
  try {
    const resp = await doJsonAuthRequest({
      url: CHANGE_USER_SETTINGS_URL,
      method: 'post',
      data: { name, email, srcAvatar }
    })
    dispatch({
      type: CHANGE_USER_SETTINGS,
      payload: { name: resp.name, email: resp.email, srcAvatar }
    })
  } catch (e) {
    console.log('Error: ' + e)
  }
}

// export const changeUserPicture = (image, user) => async (dispatch) => {
//   const filenameForAndroid = getFilenameForAndroid(image)
//   const token = await getToken()
//   dispatch({
//     type: UPLOAD_USER_PHOTO_START,
//   })
//   const resp = await RNFetchBlob.fetch('POST', UPLOAD_URL, {
//     Authorization: token,
//     // this is required, otherwise it won't be process as a multipart/form-data request
//     'Content-Type': 'multipart/form-data',
//   }, [
//       {
//         name: Platform.OS === "ios" ? image.filename : filenameForAndroid,
//         filename: Platform.OS === "ios" ? image.filename : filenameForAndroid,
//         data: RNFetchBlob.wrap(image.path),
//         type: image.mime
//       },
//     ]).uploadProgress({ interval: 50 }, (written, total) => {
//       dispatch({
//         type: UPLOAD_USER_PHOTO_PROGRESS,
//         payload: written / total
//       });
//     })
//   dispatch({
//     type: UPLOAD_USER_PHOTO_END
//   });
//   const newUrl = JSON.parse(resp.data)
//   const updateUser = await doJsonAuthRequest({
//     url: CHANGE_USER_SETTINGS_URL,
//     method: "post",
//     data: { ...user, srcAvatar: newUrl[Platform.OS === "ios" ? image.filename : filenameForAndroid].url }
//   });
//   dispatch({
//     type: CHANGE_USER_SETTINGS,
//     payload: updateUser
//   });
// }
