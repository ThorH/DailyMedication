import { View, Button, Text, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { propsStack } from "../../types/routes";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { 
  ReturnToMedicationList,
  ReturnToMedicationListText,
  FormContainer,
  RegisterField,
  DescriptionField,
  DosagesField,
  SchedulesContainer,
  ScheduleContainer,
  TimeContainer,
  TimeLabel
} from './styles'
import MedicationType from '../../types/MedicationType';
import { useMedications } from '../../hooks/useMedications';
import ScheduleType from '../../types/ScheduleType';
import uuid from 'react-native-uuid';
import { addNotification } from '../../services/notifications';
import { getGoogleImage } from '../../services/googleapi';

export default function MedicationRegister() {
  const navigation = useNavigation<propsStack>();
  const { addMedication } = useMedications();
  
  const [nameInput, onChangeNameInput] = useState('');
  const [descriptionInput, onChangeDescriptionInput] = useState('');
  const [dosagesInput, onChangeDosagesInput] = useState('');

  const buildSchedulesDefault = () => {
    const arraySchedules: ScheduleType[] = [{id: '', hour: '', minute: ''}]

    for(let i = 1; i < Number(dosagesInput); i++) {
      arraySchedules.push({id: '', hour: '', minute: ''})
    }

    return arraySchedules
  }

  const [schedulesInput, onChangeSchedulesInput] = useState<ScheduleType[]>([{id: '', hour: '', minute: ''}])

  useEffect(() => {
    onChangeSchedulesInput(buildSchedulesDefault())
  },[dosagesInput])

  const registerMedication = async () => {
    const newSchedulesInput = await Promise.all(schedulesInput.map(async (schedule) => {
      const notificationId = await addNotification({
        title: `Tomar dose de ${nameInput}`,
        body: `Está na hora de tomar seu remédio.`,
        hour: Number(schedule.hour),
        minute: Number(schedule.minute)
      })
      const newSchedule: ScheduleType = {
        id: notificationId ? notificationId : schedule.id,
        hour: schedule.hour,
        minute: schedule.minute
      }
      console.log(`register: ${newSchedule.id}`)
      return newSchedule
    }))

    onChangeSchedulesInput(newSchedulesInput)
    
    const imageUrlGoogle = await getGoogleImage(nameInput)

    const newMedication: MedicationType = {
      id: uuid.v4().toString(),
      name: nameInput,
      imageUrl: imageUrlGoogle,
      description: descriptionInput,
      dosages: Number(dosagesInput),
      schedules: newSchedulesInput
    }

    console.log(newMedication)
    addMedication(newMedication);
    navigation.navigate('MedicationList');
  }

  const handleOnChangeSchedules = (type: 'hour' | 'minute', text: string, indexElement: number) => {
    const newSchedules = schedulesInput.map((schedule, index) => {

      if(index === indexElement) {
        if(type === "hour") {
          const newSchedule: ScheduleType = {
            id: schedule.id,
            hour: text,
            minute: schedule.minute
          }

          return newSchedule
        } else {
          const newSchedule: ScheduleType = {
            id: schedule.id,
            hour: schedule.hour,
            minute: text
          }

          return newSchedule
        }
  
      }

      return schedule
    })
    
    onChangeSchedulesInput(newSchedules)
  }

  return (
    <View style={{flex: 1}}>
      <ReturnToMedicationList onPress={() => navigation.navigate('MedicationList')}>
        <MaterialIcons name="arrow-back" size={30} color="#aaaaaa" />
        <ReturnToMedicationListText>Voltar</ReturnToMedicationListText>
      </ReturnToMedicationList>
      <ScrollView>
        <FormContainer>
          <Text>Nome</Text>
          <RegisterField 
            placeholder="Nome"
            onChangeText={onChangeNameInput}
            value={nameInput} />
          <Text>Descrição</Text>
          <DescriptionField
            style={{textAlignVertical: 'top'}}
            multiline
            numberOfLines={6}
            placeholder="Descrição"
            onChangeText={onChangeDescriptionInput}
            value={descriptionInput} />
          <Text>Dosagens</Text>
          <DosagesField 
            keyboardType="numeric"
            maxLength={2}
            placeholder="0"
            onChangeText={onChangeDosagesInput}
            value={dosagesInput} />
          <Text>Horários</Text>
          <SchedulesContainer>
              { schedulesInput.map((schedule, index) =>
                <ScheduleContainer key={index}>
                    <TimeContainer>
                      <TimeLabel>Hrs</TimeLabel>
                      <DosagesField 
                      keyboardType="numeric"
                      maxLength={2}
                      placeholder="00"
                      onChangeText={(text: string) => handleOnChangeSchedules("hour", text, index)}
                      value={schedule.hour} />
                    </TimeContainer>
                    <TimeContainer>
                      <TimeLabel>Min</TimeLabel>
                      <DosagesField 
                      keyboardType="numeric"
                      maxLength={2}
                      placeholder="00"
                      onChangeText={(text: string) => handleOnChangeSchedules("minute", text, index)}
                      value={schedule.minute} />
                    </TimeContainer>
                    
                </ScheduleContainer>
              )
              }
          </SchedulesContainer>
          <Button onPress={() => registerMedication()} title="Registar Medicamento" />
        </FormContainer>
      </ScrollView>
    </View>
  )
}