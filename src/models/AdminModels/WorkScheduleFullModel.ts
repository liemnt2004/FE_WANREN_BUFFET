// src/models/AdminModels/WorkScheduleFullModel.ts

class WorkScheduleFullModel {
  constructor(
    public username: string,
    public fullName: string,
    public userType: number,
    public shiftId: number,
    public shiftName: string,
    public workDate: Date
  ) {}
}

export default WorkScheduleFullModel;
