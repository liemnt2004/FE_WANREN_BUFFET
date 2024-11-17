class CustomerModelAdmin {
  public customerId: number;
  public username: string;
  public password: string;
  public fullName: string;
  public email: string;
  public phoneNumber: string;
  public address: string;
  public loyaltyPoints: number;
  public customerType: string;
  public accountStatus: boolean;
  public createdDate: Date;
  public updatedDate: Date;
  constructor(
    customerId: number,
    username: string,
    password: string,
    full_name: string,
    email: string,
    phoneNumber: string,
    address: string,
    loyaltyPoints: number,
    customerType: string,
    accountStatus: boolean,
    createdDate: Date,
    updatedDate: Date
  ) {
    this.customerId = customerId;
    this.username = username;
    this.password = password;
    this.fullName = full_name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.loyaltyPoints = loyaltyPoints;
    this.customerType = customerType;
    this.accountStatus = accountStatus;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}

export default CustomerModelAdmin;
