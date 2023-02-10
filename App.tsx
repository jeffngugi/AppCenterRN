import {Text, Button, SafeAreaView, Alert} from 'react-native';
import React, {useEffect} from 'react';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
const App = () => {
  const checkPreviousSession = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();

    if (didCrash) {
      Alert.alert('Sorry about the crash, we are working for solutions');
    }
  };

  useEffect(() => {
    checkPreviousSession();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>App</Text>
      <Button
        title="Calculate inflation"
        onPress={() =>
          Analytics.trackEvent('Calculate_inflation', {wifi: 'off', GPS: 'On'})
        }
      />
    </SafeAreaView>
  );
};

export default App;
