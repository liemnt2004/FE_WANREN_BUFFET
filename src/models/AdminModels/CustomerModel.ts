class CustomerModelAdmin {
  public customerId: number;
  public username: string;
  public password: string;
  public fullname: string;
  public email: string;
  public phonenumber: string;
  public address: string;
  public loyaltyPoints: number;
  public customerType: string;
  public accountStatus: boolean;
  public createdDate: string; 

  constructor(
    customerId: number,
    username: string,
    password: string,
    fullname: string,
    email: string,
    phonenumber: string,
    address: string,
    loyaltyPoints: number,
    customerType: string,
    accountStatus: boolean,
    createdDate: string 
  ) {
    this.customerId = customerId;
    this.username = username;
    this.password = password;
    this.fullname = fullname;
    this.email = email;
    this.phonenumber = phonenumber;
    this.address = address;
    this.loyaltyPoints = loyaltyPoints;
    this.customerType = customerType;
    this.accountStatus = accountStatus;
    this.createdDate = createdDate; 
  }
}

export default CustomerModelAdmin;
