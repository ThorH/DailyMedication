import styled from "styled-components/native";

export const MedicationrRegisterContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const ReturnToMedicationList = styled.Pressable`
    flex-direction: row;
    align-items: center;
    margin: 10px;
`;

export const ReturnToMedicationListText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-left: 5px;
`;

export const FormContainer = styled.View`
    margin-top: 15px;
    justify-content: center;
    margin: 30px 30px;
`;

export const RegisterField = styled.TextInput`
    width: 80%;
    margin: 10px 0;
    font-size: 18px;
    background-color: #cccccc;
    padding: 10px 15px;
    border-radius: 12px;
`;

export const DescriptionField = styled.TextInput`
    width: 80%;
    margin: 10px 0;
    font-size: 18px;
    background-color: #cccccc;
    padding: 10px 15px;
    border-radius: 12px;
`;

export const DosagesField = styled.TextInput`
    width: 50px;
    margin: 10px 0;
    font-size: 18px;
    background-color: #cccccc;
    padding: 10px 15px;
    border-radius: 12px;
`;

export const SchedulesContainer = styled.View`
    width: 80%;
    flex: 1;
   
    flex-wrap: wrap;
`;

export const ScheduleContainer = styled.View`
    flex: 1;
    flex-direction: row;
    
`;

export const TimeContainer = styled.View`
    margin: 0 10px;
`;

export const TimeLabel = styled.Text`
    margin-left: 5px; 
`;