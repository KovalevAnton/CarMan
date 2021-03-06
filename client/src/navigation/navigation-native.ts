import { Navigation } from "react-native-navigation";
import {
  on,
  NAVIGATE_WELCOME,
  NAVIGATE_CHAT_LIST,
  NAVIGATE_MAP,
  NAVIGATE_SIGN_IN,
  NAVIGATE_SIGN_UP,
  NAVIGATE_JOBS
} from "../helpers/eventBus";

on(NAVIGATE_WELCOME, () =>
  Navigation.setRoot({
    root: {
      component: {
        id: "Welcome",
        name: "Welcome"
      }
    }
  })
);

on(NAVIGATE_CHAT_LIST, () => {
  Navigation.setRoot({
    root: {
      stack: {
        id: "ChatList",
        children: [
          {
            component: {
              name: "ChatList",
              options: {
                topBar: {
                  visible: false,
                }
              },
            }
          }
        ],
      }
    }
  });
});

on(NAVIGATE_MAP, () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: "Map",
        children: [
          {
            component: {
              name: "Map",
              options: {
                topBar: {
                  visible: false,
                }
              }
            }
          }
        ]
      }
    }
  })
);

on(NAVIGATE_JOBS, () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: "Jobs",
        children: [
          {
            component: {
              name: "Jobs",
              options: {
                topBar: {
                  visible: false,
                }
              }
            }
          }
        ]
      }
    }
  })
);
on(NAVIGATE_SIGN_IN, () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: "SignIn",
        children: [
          {
            component: {
              name: "SignIn",
              options: {
                topBar: {
                  visible: false,
                }
              }
            }
          }
        ]
      }
    }
  })
);
