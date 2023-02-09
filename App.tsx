import {
  Text,
  Button,
  SafeAreaView,
  Alert,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';

const App = () => {
  const checkPreviousSession = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();

    if (didCrash) {
      Alert.alert('Sorry about the crash, we are working for a solution');
    }
  };

  useEffect(() => {
    checkPreviousSession();
  }, []);

  const [state, setState] = useState({
    inflationRate: 0.0,
    riskFreeRate: 0.0,
    amount: 0.0,
    timeInYears: 1,
    afterInflation: 0.0,
    atRiskFree: 0.0,
    atRiskFreeAfterInflation: 0.0,
    difference: 0,
  });

  function calculateInflationImpact(value, inflationRate, time) {
    return value / Math.pow(1 + inflationRate, time);
  }

  function calculate() {
    const afterInflation = calculateInflationImpact(
      state.amount,
      state.inflationRate / 100,
      state.timeInYears,
    );
    const atRiskFree =
      state.amount * Math.pow(1 + state.riskFreeRate / 100, state.timeInYears);
    const atRiskFreeAfterInflation = calculateInflationImpact(
      atRiskFree,
      state.inflationRate / 100,
      state.timeInYears,
    );
    const difference = atRiskFreeAfterInflation - afterInflation;
    setState({
      ...state,
      afterInflation,
      atRiskFree,
      atRiskFreeAfterInflation,
      difference,
    });
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TextInput
          placeholder="Current inflation rate in your country"
          style={styles.textBox}
          keyboardType="decimal-pad"
          onChangeText={inflationRate => setState({...state, inflationRate})}
        />
        <TextInput
          placeholder="Current risk free rate"
          style={styles.textBox}
          keyboardType="decimal-pad"
          onChangeText={riskFreeRate => setState({...state, riskFreeRate})}
        />
        <Text style={styles.smallLabel}>
          The risk free rate is the one offered by your country's central bank.
        </Text>
        <TextInput
          placeholder="Amount you are saving today"
          style={styles.textBox}
          keyboardType="decimal-pad"
          onChangeText={amount => setState({...state, amount})}
        />
        <TextInput
          placeholder="For how long (in years) will you save that?"
          style={styles.textBox}
          keyboardType="decimal-pad"
          onChangeText={timeInYears => setState({...state, timeInYears})}
        />
        <Button
          title="Calculate inflation"
          onPress={() => {
            calculate();
            Analytics.trackEvent('Calculate_inflation', {
              wifi: 'off',
              GPS: 'On',
            });
          }}
        />
        <Text style={styles.label}>
          {state.timeInYears} years from now you will still have $
          {parseFloat(state.amount)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
          , but it will only be worth $
          {parseFloat(state.afterInflation)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
          .
        </Text>
        <Text style={styles.label}>
          But if you invest it at a risk free rate you will have $
          {parseFloat(state.atRiskFree)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
          .
        </Text>
        <Text style={styles.label}>
          Which will be worth $
          {parseFloat(state.atRiskFreeAfterInflation)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}{' '}
          after inflation.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 16,
  },
  label: {
    marginTop: 10,
  },
  smallLabel: {
    marginTop: -8,
    marginBottom: 10,
    fontSize: 12,
    color: 'gray',
  },
  textBox: {
    height: 40,
    paddingLeft: 6,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  scrollView: {
    backgroundColor: 'gray',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'green',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: 'green',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
