import React from "react";
import { connect } from "react-redux";
import { View, Dimensions } from "react-native";
import _ from "lodash";
import styled from "styled-components";
import {
  WHITE_COLOR,
  SOFT_BLUE_COLOR,
  BLACK_COLOR,
  GRAY_COLOR
} from "../../helpers/styleConstants";
import { createNewJob } from "../../actions/job";
import Input from "../CommonUIElements/Input";
import Header from "../Header";
import Button from "../CommonUIElements/Button";
import { Navigation } from "react-native-navigation";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TextInputMask } from "react-native-masked-text";
import { goToMap } from "../../navigation/navigation";

const { width } = Dimensions.get("window");

interface IState {
  location: object;
  address: string;
  title: string;
  datetime: string;
  car: string;
  description: string;
  price: string;
}

interface IProps {
  createNewJob: (user: object, job: object) => void;
  jobs: any;
}

class AddJob extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      location: {},
      title: "",
      datetime: "",
      car: "",
      description: "",
      price: ""
    };
  }

  public createNewJob() {
    this.props.createNewJob(this.props.auth, {
      address: this.state.address,
      location: this.state.location,
      title: this.state.title,
      datetime: this.state.datetime,
      car: this.state.car,
      description: this.state.description,
      price: this.state.price
    });
    goToMap();
  }

  public render() {
    return (
      <AddJobWrap>
        <Header
          title="Add Job"
          width={width}
          leftIconName="arrow-left"
          leftIconFunction={() => {
            Navigation.popToRoot("Jobs");
          }}
        />
        <AddJobView>
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            minLength={2}
            debounce={200}
            autoFocus={false}
            returnKeyType={"default"}
            fetchDetails={true}
            currentLocation={false}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              this.setState({
                location: details.geometry.location,
                address: details.formatted_address
              });
            }}
            query={{
              key: "AIzaSyCuUETlrZwfgzdH1Dche10n2i_35OT3TWU",
              language: "ru", // language of the results
              types: "geocode" // default: 'geocode'
            }}
            filterReverseGeocodingByTypes={[
              "locality",
              "administrative_area_level_3"
            ]}
            listViewDisplayed="false"
            styles={{
              textInputContainer: {
                backgroundColor: "rgba(0,0,0,0)",
                borderTopWidth: 0,
                borderBottomWidth: 0,
                width: "80%"
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: "#5d5d5d",
                fontSize: 16
              },
              container: {
                flex: 0
              }
            }}
          />
          <Input
            placeholder="Title"
            onChangeText={title => this.setState({ title })}
            value={this.state.title}
          />
          <TextInputMask
            type={"datetime"}
            keyboardType="numeric"
            placeholder={"DD/MM/YYYY HH:mm"}
            options={{
              format: "DD/MM/YYYY HH:mm:ss"
            }}
            onChangeText={datetime => {
              this.setState({ datetime });
            }}
            maxLength={16}
            value={this.state.datetime}
          />
          <Input
            placeholder="Car"
            onChangeText={car => this.setState({ car })}
            value={this.state.car}
          />
          <Input
            placeholder="Description"
            onChangeText={description => this.setState({ description })}
            value={this.state.description}
          />
          <Input
            placeholder="Price"
            keyboardType="numeric"
            onChangeText={price => this.setState({ price })}
            value={this.state.price}
          />
          <Button onPress={() => this.createNewJob()}>Create Job</Button>
        </AddJobView>
      </AddJobWrap>
    );
  }
}

const AddJobWrap = styled(View)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const AddJobView = styled(View)`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  width: ${width};
`;

const mapDispatchToProps = {
  createNewJob
};

const mapStateToProps = state => ({ auth: state.auth, chat: state.chat });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddJob);
