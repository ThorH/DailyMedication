import styled from "styled-components/native";

export const MedicationListContainer = styled.View`
    flex: 1;
    margin-top: 15px;
    align-items: center;
`;

export const ItemMedicationContainer = styled.View`
    margin: 15px 0;
    flex-direction: row;
`;

export const ItemMedication = styled.Pressable`
    width: 80%;
    padding: 10px 5px;
    background-color: #ccc;
    border-radius: 6px;
    flex-direction: row;
`;

export const MedicationImage = styled.Image`
    width: 70px;
    height: 70px;
    margin: 5px 10px;
`;


export const NoMedicationRegistred = styled.View`
    width: 80%;
    padding: 10px;
    border-radius: 6px;
    background-color: #ccc;
    margin-bottom: 15px;
`;

export const NoMedicationRegistredText = styled.Text`
    font-size: 18px;
    text-align: center;
`;

export const TopNavigation = styled.View`
    align-items: flex-end;
`;

export const GoToHistory = styled.Pressable`
    flex-direction: row;
    align-items: center;
    margin: 10px;
`;

export const GoToHistoryText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-right: 5px;
`;