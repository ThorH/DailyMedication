import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MedicationsProvider } from './hooks/useMedications';
const { Navigator, Screen } = createNativeStackNavigator();
import MedicationList from './components/MedicationList';
import MedicationRegister from './components/MedicationRegister';
import { 
  AppContainer,
  MainContainer
} from './AppStyles';
import MedicationHistory from './components/MedicationHistory';
import MedicationDetails from './components/MedicationDetails';

export default function App() {
  return (
    <AppContainer>
      <NavigationContainer>
        <MedicationsProvider>
          <MainContainer>
            <Navigator initialRouteName='MedicationList' screenOptions={{ headerShown: false }}>
              <Screen name='MedicationList' component={MedicationList} />
              <Screen name='MedicationRegister' component={MedicationRegister} />
              <Screen name='MedicationHistory' component={MedicationHistory} />
              <Screen name='MedicationDetails' component={MedicationDetails} />
            </Navigator>
          </MainContainer>
        </MedicationsProvider>
      </NavigationContainer>
      <StatusBar style="auto" />
    </AppContainer>
  );
}
