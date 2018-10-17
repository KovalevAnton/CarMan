import { Navigation } from "react-native-navigation";
import "./helpers/eventBus";
import { registerScreens } from "./screens";
import "./navigation/navigation-native";

// This is to see network requests in Chrome Dev Tools
XMLHttpRequest = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;
//

registerScreens(Navigation);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        options: {
          topBar: {
            visible: false,
          }
        },
        id: "carMan",
        children: [
          {
            component: {
              name: "carMan"
            }
          }
        ],
      }
    }
  });
});
