class UserModel {
    private _userId: number;
    private _username: string;
    private _password: string;
    private _fullName: string;
    private _email: string;
    private _phoneNumber: string;
    private _address: string;
    private _userType: string;
    private _accountStatus: string;

    constructor(
        userId: number,
        username: string,
        password: string,
        fullName: string,
        email: string,
        phoneNumber: string,
        address: string,
        userType: string,
        accountStatus: string
    ) {
        this._userId = userId;
        this._username = username;
        this._password = password;
        this._fullName = fullName;
        this._email = email;
        this._phoneNumber = phoneNumber;
        this._address = address;
        this._userType = userType;
        this._accountStatus = accountStatus;
    }

    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get fullName(): string {
        return this._fullName;
    }

    set fullName(value: string) {
        this._fullName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get userType(): string {
        return this._userType;
    }

    set userType(value: string) {
        this._userType = value;
    }

    get accountStatus(): string {
        return this._accountStatus;
    }

    set accountStatus(value: string) {
        this._accountStatus = value;
    }
}
export default UserModel;
