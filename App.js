import React from 'react';
import { Provider } from 'react-redux';
import { Text, TextInput, Platform, UIManager } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleProvider, getTheme, Root } from 'native-base';
import theme from '@theme/variables/commonColor';
import Index from '@screens/index';
import configureStore from '@store';
import _ from "lodash";
import Reactotron from 'reactotron-react-native'

// Redux Storage
const { persistor, store } = configureStore();

// Android Animation Enabled
Platform.OS === 'android' ? UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true) : null;

global.log = (input) => Reactotron.log(input);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }

  render() {
    return (
      <Root>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <StyleProvider style={getTheme(theme)}>
              <Index />
            </StyleProvider>
          </PersistGate>
        </Provider>
      </Root>
    );
  }
}
