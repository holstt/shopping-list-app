import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
  Button,
  TouchableOpacity,
} from "react-native";

export default function TestComponent() {
  const onSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    console.log("got new submit: " + e?.nativeEvent?.text);
  };

  return (
    <View>
      <TextInput testID="test-1" onSubmitEditing={onSubmitEditing}></TextInput>
      <TouchableOpacity testID="test-2"></TouchableOpacity>
    </View>
  );
}
