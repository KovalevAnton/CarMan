import {
  emit,
  NAVIGATE_WELCOME,
  NAVIGATE_CHAT_LIST,
  NAVIGATE_MAP,
  NAVIGATE_SIGN_IN
} from "../helpers/eventBus";

export const goWelcome = () => emit(NAVIGATE_WELCOME);
export const goToMap = () => emit(NAVIGATE_MAP);
export const goToChatList = () => emit(NAVIGATE_CHAT_LIST);
export const goToSignIn = () => emit(NAVIGATE_SIGN_IN);
