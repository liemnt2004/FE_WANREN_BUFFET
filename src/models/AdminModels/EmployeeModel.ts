class EmployeeAdmin {
  constructor(
    public userId: number,
    public username: string,
    private password: string,
    public fullName: string,
    public email: string,
    public phoneNumber: string,
    public address: string,
    public userType: string,
    public accountStatus: string
  ) {}

  getPassword(): string {
    return this.password;
  }

  setPassword(newPassword: string): void {
    this.password = newPassword;
  }
}
export default EmployeeAdmin;
