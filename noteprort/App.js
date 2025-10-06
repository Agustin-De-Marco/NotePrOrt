import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NotesProvider } from './src/context/NotesContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotesProvider>
        <AppNavigator />
      </NotesProvider>
    </GestureHandlerRootView>
  );
};

export default App;
