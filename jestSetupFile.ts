import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

// Provide mock for jest

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
// jest.mock("react-native-paper");
