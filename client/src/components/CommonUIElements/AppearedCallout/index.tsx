import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { BLACK_COLOR, WHITE_COLOR } from "../../../helpers/styleConstants";
import { Marker, Callout } from "react-native-maps";
import truck_green from "../../../assets/truck_green.png";
import styled from "styled-components";
import Button from "../Button";

const AppearedCallout = ({
  coordinate,
  customerName,
  jobAddress,
  jobDatetime,
  jobCar,
  ...otherProps
}) => {
  return (
    <Marker coordinate={coordinate} image={truck_green}>
      <Callout tooltip>
        <CalloutView>
          <Text>{customerName}</Text>
          <Text>{jobAddress}</Text>
          <Text>{jobDatetime}</Text>
          <Text>{jobCar}</Text>
          <Button>Call</Button>
        </CalloutView>
      </Callout>
    </Marker>
  );
};

export default AppearedCallout;

const CalloutView = styled(View)`
  border: 1px solid #bbb;
  border-radius: 5px;
  padding: 10px;
  background-color: ${WHITE_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
`;
