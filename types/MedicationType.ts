import ScheduleType from "./ScheduleType";

export default interface MedicationType {
    id: string,
    name: string,
    imageUrl: string
    description: string,
    dosages: number,
    schedules: ScheduleType[],
}