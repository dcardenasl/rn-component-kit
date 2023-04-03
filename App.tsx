/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import CustomButton from './src/UI/Components/CustomButton';
import CustomModal, {RefModalObject} from './src/UI/Components/CustomModal';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const refModal = useRef<RefModalObject>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  console.log('new Render');

  const _section = (): JSX.Element => (
    <View style={{flex: 1, alignItems: 'center'}}>
      <CustomButton
        style={styles.btn}
        onPress={() => {
          refModal.current?.open();
        }}>
        <Text style={styles.text}>Texto de pruebas</Text>
      </CustomButton>
    </View>
  );

  const _modals = (): JSX.Element => (
    <>
      <CustomModal ref={refModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton
            style={styles.btn}
            onPress={() => {
              refModal.current?.close();
            }}>
            <Text style={styles.text}>Cerrar</Text>
          </CustomButton>
        </View>
      </CustomModal>
    </>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {_section()}
        </View>
      </ScrollView>
      {_modals()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 50,
    width: '70%',
    borderRadius: 20,
    marginVertical: '5%',
    backgroundColor: 'red',
  },
  text: {color: 'white', fontWeight: 'bold'},
});

export default App;
