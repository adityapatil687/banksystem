// navigator
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator, TransitionPresets, } from '@react-navigation/stack';

// screens
import TransferScreen from "./Screens/TransferScreen";
import ReadScreen from './Screens/ReadScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ gestureEnabled: true, cardOverlayEnabled: true, ...TransitionPresets.SlideFromRightIOS,}}>
        <Stack.Screen name="ReadScreen" component={ReadScreen} options={{headerShown: false}} />
        <Stack.Screen name="TransferScreen" component={TransferScreen} options={({route}) => ({title: route.params.first_name + " " + route.params.last_name})} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}