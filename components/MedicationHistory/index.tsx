import React from 'react'
import { View, Text, Button, Pressable, ScrollView } from 'react-native'
import { useMedications } from '../../hooks/useMedications'
import { useNavigation } from '@react-navigation/native'
import { propsStack } from '../../types/routes'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { 
    ItemMedicationContainer,
    NoMedicationRegistred,
    NoMedicationRegistredText 
} from '../MedicationList/styles';
import { HistoryItem } from './styles'
import { 
    ReturnToMedicationList,
    ReturnToMedicationListText
} from '../MedicationRegister/styles';
import {
    MedicationHistoryContainer
} from './styles';

export default function MedicationHistory() {
    const { history, removeItemHistory, clearHistory } = useMedications();
    const navigation = useNavigation<propsStack>();

  return (
    <>
        <ReturnToMedicationList onPress={() => navigation.navigate('MedicationList')}>
            <MaterialIcons name="arrow-back" size={30} color="#aaaaaa" />
            <ReturnToMedicationListText>Voltar</ReturnToMedicationListText>
        </ReturnToMedicationList>
        <ScrollView>
            <MedicationHistoryContainer>
                { history.length > 0 ?
                    history.map(historyItem => 
                        <ItemMedicationContainer key={historyItem.idMedication}>
                            <HistoryItem>
                                <Text>Nome: {historyItem.name}</Text>
                                <Text>Registrado em: {historyItem.created_at}</Text>
                            </HistoryItem>
                            <Pressable onPress={() => removeItemHistory(historyItem.idMedication)}>
                                <MaterialIcons name="delete" size={30} color="#a10f0f" />
                            </Pressable>
                        </ItemMedicationContainer>
                        
                    )
                    :
                    <NoMedicationRegistred>
                        <NoMedicationRegistredText>Nenhum medicamento no histórico</NoMedicationRegistredText>
                    </NoMedicationRegistred>
                }
                <Button title="Limpar histórico" onPress={() => clearHistory()}/>
            </MedicationHistoryContainer>
        </ScrollView>
    </>
  )
}