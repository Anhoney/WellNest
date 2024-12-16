// import React from "react";
// import { CheckBox } from "@react-native-community/checkbox";
// import { View, Text } from "react-native";

// const CustomCheckBox = ({
//   title = "",
//   checked = false,
//   onPress = () => {},
//   containerStyle = {
//     backgroundColor: "transparent",
//     borderWidth: 0,
//     marginBottom: -5,
//   },
//   textStyle = { fontSize: 16, fontWeight: "normal" },
//   ...props
// }) => {
//   return (
//     <View style={containerStyle}>
//       <CheckBox value={checked} onValueChange={onPress} {...props} />
//       <Text style={textStyle}>{title}</Text>
//     </View>
//   );
// };

// export default CustomCheckBox;

import React from "react";
import { CheckBox } from "react-native-elements";

const CustomCheckBox = ({
  title = "",
  checked = false,
  onPress = () => {},
  containerStyle = {},
  textStyle = {},
}) => (
  <CheckBox
    title={title}
    checked={checked}
    onPress={onPress}
    containerStyle={containerStyle}
    textStyle={textStyle}
  />
);

export default CustomCheckBox;
