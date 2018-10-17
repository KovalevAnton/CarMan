import { Navigation } from "react-native-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  on,
  NAVIGATE_WELCOME,
  NAVIGATE_SIGNIN,
  NAVIGATE_CHAT_LIST,
  NAVIGATE_MAP
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
        options: {
          topBar: {
            visible: false,

          }
        },
        id: "ChatList",
        children: [
          {
            component: {
              name: "ChatList"
            }
          }
        ],
      }
    }
  });
});

on(NAVIGATE_SIGNIN, () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: "SignIn",
        children: [
          {
            component: {
              name: "SignIn"
            }
          }
        ]
      }
    }
  })
);

const burgerIconUri = Icon.getImageSource('user', 20, 'red').then((source) => console.log(source));

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
                  title: {
                    text: 'Pushed screen title'
                  },
                  rightButtons: [
                    {
                      id: 'buttonOne',
                      // icon: require("/var/mobile/Containers/Data/Application/2498C78E-26B6-43B6-B55F-FB8CD5FF2E55/tmp/RNVectorIcons__FontAwesome_61447_20#FF0000@2x.png")
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  })
);
