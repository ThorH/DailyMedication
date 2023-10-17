import { View, Button, Image, Dimensions, Alert, ScrollView, Text, ImageComponent } from 'react-native'
import axios from 'axios';

import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { propsNavigationStack, propsStack } from "../../types/routes";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Pdf from 'react-native-pdf';
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
} from '../MedicationRegister/styles'
import { ButtonContainer } from './styles';
import MedicationType from '../../types/MedicationType';
import { useMedications } from '../../hooks/useMedications';
import { addNotification, removeNotificationById, removeAllNotifications } from '../../services/notifications';
import ScheduleType from '../../types/ScheduleType';
import { getGoogleImage } from '../../services/googleapi';


export default function MedicationDetails() {
  const { params } = useRoute<RouteProp<propsNavigationStack, 'MedicationDetails'>>();
  const idMedication = params.idMedication;
  const navigation = useNavigation<propsStack>();
  const { medications, updateMedication } = useMedications();

  const getMedication = (id: string) => {
      const foundMedication = medications.find(medication => medication.id === id)
      const emptyMedicaiton: MedicationType = {
          id: id,
          name: '',
          imageUrl: '',
          description: '',
          dosages: 0,
          schedules: [{id: '', hour: '', minute: ''}]
      }

      return foundMedication ? foundMedication : emptyMedicaiton
  }
  const medication = getMedication(idMedication)
  
  const [nameInput, onChangeNameInput] = useState(medication.name);
  const [image, setImage] = useState(medication.imageUrl);
  const [descriptionInput, onChangeDescriptionInput] = useState(medication.description);
  const [dosagesInput, onChangeDosagesInput] = useState(medication.dosages.toString());
  const [schedulesInput, onChangeSchedulesInput] = useState<ScheduleType[]>(medication.schedules)
  const [pdf, setPdf] = useState<string>();

  const buildSchedulesDefault = () => {
    const newSchedules = [...schedulesInput]

    if(schedulesInput.length !== Number(dosagesInput) && dosagesInput !== '') {
      if(Number(dosagesInput) > schedulesInput.length) {
        for(let i = schedulesInput.length; i < Number(dosagesInput); i++) {
          newSchedules.push({id: '', hour: '', minute: ''})
        }
        
      } else if(Number(dosagesInput) < schedulesInput.length) {
        for(let i = schedulesInput.length; i > Number(dosagesInput); i--) {
          const schedulePoped = newSchedules.pop()
          if(schedulePoped) {
            if(schedulePoped.id.length) {
              removeNotificationById(schedulePoped.id)
            }
          }
        }
      }
    }

    return newSchedules
  } 

  useEffect(() => {  
    onChangeSchedulesInput(buildSchedulesDefault())
  },[dosagesInput])

  const showPdf = async () => {
      const { data } = await axios.get(`https://bula.vercel.app/pesquisar?nome=${medication.name}&pagina=1`);

      const idBula = data.content[0].idBulaPacienteProtegido
      setPdf(`https://bula.vercel.app/pdf?id=${idBula}`)
  }

  const update = async () => {
      console.log(schedulesInput)
      const newSchedulesInput = await Promise.all(schedulesInput.map(async (schedule) => {
        if(schedule.id.length) {
          await removeNotificationById(schedule.id)
          console.log(`have id: ${schedule.id}`)
        } else {
          console.log(`dont have id: ${schedule.id}`)
        }

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
        return newSchedule
      }))

      onChangeSchedulesInput(newSchedulesInput)

      let imageUrlGoogle = image

      if(nameInput !== medication.name) {
        imageUrlGoogle = await getGoogleImage(nameInput)
      }

      const updatedMedication: MedicationType = {
          id: idMedication,
          name: nameInput,
          imageUrl: imageUrlGoogle,
          description: descriptionInput,
          dosages: Number(dosagesInput),
          schedules: newSchedulesInput
      }
      updateMedication(updatedMedication)
      navigation.navigate('MedicationList')
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
    <View style={{ flex: 1}}>
      <ReturnToMedicationList onPress={() => navigation.navigate('MedicationList')}>
        <MaterialIcons name="arrow-back" size={30} color="#aaaaaa" />
        <ReturnToMedicationListText>Voltar</ReturnToMedicationListText>
      </ReturnToMedicationList>
      { !pdf ?
       <ScrollView>
          <FormContainer>
            { image.length > 0 &&
              <Image source={{uri: image}} style={{width: 150, height: 150}}/>
            }
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
            placeholder="00"
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
            
            <ButtonContainer>
                <Button onPress={() => update()} title="Atualizar Medicamento" />
            </ButtonContainer>
            <ButtonContainer>
                <Button color={'#32a852'} onPress={() => showPdf()} title="Ver bula"/>
            </ButtonContainer>
        </FormContainer>
       </ScrollView>
      :
      
      <View style={{flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,}}>
        <Pdf
          trustAllCerts={false}
          source={{uri: pdf }}
          onLoadComplete={(numberOfPages,filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page,numberOfPages) => {
              console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
              Alert.alert('Bula nao encontrada, tente novamente.')
              showPdf()
              console.log(error);
          }}
          onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
          }}
          style={{flex:1,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height}}/>
      </View>

      }
    </View>
  )
}