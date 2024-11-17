class AdminModel {
  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public fullName: string,
    public email: string,
    public phoneNumber: string,
    public address: string,
    public customerType: string,
    public accountStatus: boolean,
    public createdDate: Date,
    public updatedDate: Date
  ) {}
}

export default AdminModel;
