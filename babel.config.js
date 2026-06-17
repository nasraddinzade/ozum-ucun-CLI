module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated 4 uses the Worklets babel plugin. It MUST be listed last.
  plugins: ['react-native-worklets/plugin'],
};
