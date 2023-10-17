import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type propsNavigationStack = {
    MedicationList: undefined,
    MedicationRegister: undefined,
    MedicationHistory: undefined,
    MedicationDetails: {
        idMedication: string
    }
}

export type propsStack = NativeStackNavigationProp<propsNavigationStack>;