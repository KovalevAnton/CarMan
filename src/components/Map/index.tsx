import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { ScrollView, Animated, Dimensions, View, StatusBar, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { checkAuth } from "../../actions/auth";
import styled from "styled-components";
import { getMessages, setActiveChat } from "../../actions/chat";
import Chat from "../Chat";
import Header from "../Header";


const { width } = Dimensions.get('window')

interface IProps {
}

class Map extends React.Component {
    constructor(props) {
        super(props);
    }
    public render() {
        return (
            <Wrap>
                <Header />
                <MapView
                    provider={MapView.PROVIDER_GOOGLE}
                    style={{ width: 500, height: 500 }}
                    initialRegion={{
                        latitude: 56.323318,
                        longitude: 44.004773,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </Wrap>
        );
    }
}

const mapDispatchToProps = {
    checkAuth
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);

const Wrap = styled(View)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
