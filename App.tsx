import {Text, Button, SafeAreaView} from 'react-native';
import React from 'react';
import Crashes from 'appcenter-crashes';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>App</Text>
      <Button
        title="Crash the app"
        onPress={() => Crashes.generateTestCrash()}
      />
    </SafeAreaView>
  );
};

export default App;
