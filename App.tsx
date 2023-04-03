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

import CustomButton from './src/CustomButton';
import CustomModal, {RefModalObject} from './src/CustomModal';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const refModal = useRef<RefModalObject>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  console.log('new Render');

  const _section = (): JSX.Element => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <CustomButton
        // disabled={true}
        // loading={true}
        style={styles.btn}
        backgroundColor={'red'}
        onPress={() => {
          refModal.current?.open();
        }}>
        <Text style={styles.text}>Abrir Modal</Text>
      </CustomButton>
    </View>
  );

  const _modals = (): JSX.Element => (
    <>
      <CustomModal ref={refModal} slideDirection={'right'}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton
            style={styles.btn}
            backgroundColor={'red'}
            onPress={() => {
              refModal.current?.close();
            }}>
            <Text style={styles.text}>Cerrar Modal</Text>
          </CustomButton>
        </View>
      </CustomModal>
    </>
  );

  return (
    <SafeAreaView style={[{flex: 1}, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : 'white',
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
  },
  text: {color: 'white', fontWeight: 'bold'},
});

export default App;
