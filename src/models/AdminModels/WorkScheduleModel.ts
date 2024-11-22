// src/models/AdminModels/WorkScheduleModel.ts

class WorkScheduleModel {
  constructor(
    public username: string,
    public shiftId: number,
    public workDate: Date
  ) {}
}

export default WorkScheduleModel;
