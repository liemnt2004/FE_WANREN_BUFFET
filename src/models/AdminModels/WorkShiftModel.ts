class WorkShiftModel {
  constructor(
    public userId: number,
    public shiftId: number,
    public username: string,
    public fullName: string | null,
    public position: string,
    public totalHours: Number,
    public workDate: Date
  ) {}
}
export default WorkShiftModel;
