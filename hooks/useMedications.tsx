import React, { createContext, useContext, useState } from "react";
import ItemHistoryType from "../types/ItemHistoryType";
import MedicationType  from '../types/MedicationType';
import { setStoreMedication, setStoreHistory } from "../services/storage";

interface Props {
    children: React.ReactNode
}

interface MedicationsContextType {
    medications: MedicationType[],
    updateMedications: (Medications: MedicationType[]) => void,
    history: ItemHistoryType[],
    updateHistory: (History: ItemHistoryType[]) => void,
    addMedication: (Medication: MedicationType) => void,
    removeMedication: (id: string) => void,
    updateMedication: (Medication: MedicationType) => void
    removeItemHistory: (id: string) => void,
    clearHistory: () => void
}

const initialValue: MedicationsContextType = {
    medications: [],
    updateMedications: () => { },
    history: [],
    updateHistory: () => { },
    addMedication: () => { },
    removeMedication: () => { },
    updateMedication: () => { },
    removeItemHistory: () => { },
    clearHistory: () => { }
}

const MedicationsContext = createContext<MedicationsContextType>(initialValue);

export const MedicationsProvider = ({ children }: Props) => {
    const [medications, setMedications] = useState<MedicationType[]>([]);
    const [history, setHistory] = useState<ItemHistoryType[]>([])

    const updateMedications = (medications: MedicationType[]) => {
        setMedications(medications)
    }

    const updateHistory = (history: ItemHistoryType[]) => {
        setHistory(history)
    }

    const addMedication = (medication: MedicationType) => {
        setMedications([...medications, medication]);
        setStoreMedication([...medications, medication])

        const currentDate = new Date().toDateString()
        setHistory([...history, {idMedication: medication.id,name: medication.name, created_at: currentDate}])
        setStoreHistory([...history, {idMedication: medication.id,name: medication.name, created_at: currentDate}])
    }

    const removeMedication = (id: string) => {
        const updatedMedications = medications.filter(medication => medication.id !== id );
        setMedications(updatedMedications);
        setStoreMedication(updatedMedications)
    }

    const updateMedication = (newMedication: MedicationType) => {
        let updatedMedications = medications.filter(medication => medication.id !==  newMedication.id);
        updatedMedications.push(newMedication);
        setMedications(updatedMedications);
        setStoreMedication(updatedMedications)

        const foundItemHistory = history.find(itemHistory => itemHistory.idMedication === newMedication.id);
        let updatedHistory = history.filter(itemHistory => itemHistory.idMedication !== newMedication.id);
        updatedHistory.push({
            idMedication: newMedication.id,name: 
            newMedication.name, 
            created_at: foundItemHistory?.created_at ? foundItemHistory.created_at : new Date().toDateString()
        });
        setHistory(updatedHistory);
        setStoreHistory(updatedHistory)
    }
    const removeItemHistory = (id: string) => {
        const updatedHistory = history.filter(itemHistory => itemHistory.idMedication !== id);
        setHistory(updatedHistory);
        setStoreHistory(updatedHistory)
    }

    const clearHistory = () => {
        setHistory([]);
        setStoreHistory([])
    }

    return (
        <MedicationsContext.Provider
            value={{
                medications,
                updateMedications,
                addMedication,
                removeMedication,
                updateMedication,
                history,
                updateHistory,
                removeItemHistory,
                clearHistory
            }}>
            {children}
        </MedicationsContext.Provider>
    )
}

export const useMedications = () => useContext(MedicationsContext)