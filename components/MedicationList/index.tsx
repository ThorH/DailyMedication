import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, Pressable, ScrollView, Image } from "react-native";
import MedicationType from '../../types/MedicationType';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { propsStack } from "../../types/routes";
import { 
    MedicationListContainer,
    ItemMedicationContainer,
    ItemMedication,
    MedicationImage,
    NoMedicationRegistred,
    NoMedicationRegistredText,
    TopNavigation,
    GoToHistory,
    GoToHistoryText
} from "./styles";
import { useMedications } from "../../hooks/useMedications";
import { removeNotificationById } from "../../services/notifications";
import { getStoreHistory, getStoreMedication } from '../../services/storage';

export default function MedicationList() {
    const navigation = useNavigation<propsStack>();
    const { 
        medications, 
        removeMedication, 
        updateMedications, 
        history,
        updateHistory
     } = useMedications();

    const handleRemoveMedication = (medicationId: string) => {
       const medication =  medications.find(medication => medication.id === medicationId)
       medication?.schedules.forEach(schedule => {
        removeNotificationById(schedule.id)
       })

       removeMedication(medicationId)
    }

    useEffect(() => {
        if(!medications.length) {
            getStoreMedication().then(data => updateMedications(data))
        }
        if(!history.length) {
            getStoreHistory().then(data => updateHistory(data))
        }
    }, [])

    return (
        <>
            <TopNavigation>
                <GoToHistory onPress={() => navigation.navigate('MedicationHistory')}>
                    <GoToHistoryText>Histórico</GoToHistoryText>
                    <MaterialIcons name="arrow-forward" size={30} color="#aaaaaa" />
                </GoToHistory>
            </TopNavigation>
            <ScrollView>
                <MedicationListContainer>
                    { medications.length > 0 ?     
                        medications.map((medication) =>
                            <ItemMedicationContainer key={medication.id}>
                                <ItemMedication onPress={() => navigation.navigate('MedicationDetails', {idMedication: medication.id})}>
                                    { medication.imageUrl.length > 0 &&
                                        <MedicationImage source={{uri: medication.imageUrl}} />
                                    }
                                    <View style={{flex: 1}}>
                                        <Text>Nome: {medication.name}</Text>
                                        <Text>Dosagens: {medication.dosages.toString()}</Text>
                                        <Text>Horários:</Text>
                                        <View style={{width: '90%', flexDirection: 'row' , flexWrap: 'wrap'}}>
                                            {medication.schedules.map(schedule =>
                                                <Text key={schedule.id} style={{marginHorizontal: 3}}>
                                                    {schedule.hour}:{schedule.minute}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    
                                </ItemMedication>
                                <Pressable onPress={() => handleRemoveMedication(medication.id)}>
                                    <MaterialIcons name="delete" size={30} color="#a10f0f" />
                                </Pressable>
                            </ItemMedicationContainer>
                        )
                    :
                        <NoMedicationRegistred>
                            <NoMedicationRegistredText>Nenhum medicamento registrado</NoMedicationRegistredText>
                        </NoMedicationRegistred>
                    }
                    <Button 
                        title={'Registre um novo medicamento'} 
                        onPress={() => navigation.navigate('MedicationRegister')} />
                </MedicationListContainer>
            </ScrollView>
        </>
    );
}