import React from "react";
import { View, Button } from "react-native";

const VideoCallComponent = ({ onStartCall }) => {
  return (
    <View>
      <Button title="Start Video Call" onPress={onStartCall} />
    </View>
  );
};

export default VideoCallComponent;
