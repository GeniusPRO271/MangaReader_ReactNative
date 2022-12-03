import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BookDetails from './components/screens/BookDetails';
import Home from './components/screens/Home';
import Search from './components/screens/Search';
import Chapters from './components/screens/Chapters';
import ReadChapter from './components/screens/ReadChapter';
import TabBar from './components/TabBar';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BookDetails" component={BookDetails} />
        <Stack.Screen name="Chapters" component={Chapters} />
        <Stack.Screen name="ReadChapter" component={ReadChapter} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
