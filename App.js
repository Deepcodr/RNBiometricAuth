import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';

export default function App() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricSuccess, setBitometricSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  const handleBiometricAuth = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return Alert.alert(
        'Biometric record not found',
        'Please verify your identity with your password',
        'OK',
        () => fallBackToDefaultAuth()
      );
    }
    handleBiometric();
  }

  const handleBiometric = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      disableDeviceFallback: true,
      cancelLabel: 'Cancel'
    });

    if (biometricAuth.success) {
      setBitometricSuccess(true);
    }
  }

  return (
    <View style={styles.container}>
      <Text> {isBiometricSupported ? 'Your device is compatible with Biometrics'
        : 'Face or Fingerprint scanner is available on this device'}
      </Text>
      <Button
        onPress={handleBiometricAuth}
        title="Click For Biometric Auth"
        color="#841584"
      />
      <Text> {isBiometricSuccess ? 'Authentication Successful'
        : 'Failed To Authenticate Details'}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
