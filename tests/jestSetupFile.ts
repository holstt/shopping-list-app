import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

// Mock async storage
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock(
  "@expo/vector-icons/build/vendor/react-native-vector-icons/lib/create-icon-set.js",
  () => {
    return () => "";
  }
);

// Provide mock for jest

// jest.mock("react-native-paper");
