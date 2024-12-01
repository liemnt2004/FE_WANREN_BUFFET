import UserModel from "../../models/UserModel";
import { request } from "../Request";

export async function getAllUser(): Promise<UserModel[]> {
    const users: UserModel[] = [];
    try {
        const data = await request('https://wanrenbuffet.netlify.app/User');


        // Adjust the data path according to your API response structure
        if (data && data._embedded && data._embedded.users) {
            for (const user of data._embedded.users) {
                const userModel = new UserModel(
                    user.userId,
                    user.username,
                    user.password,
                    user.fullName,
                    user.email,
                    user.phoneNumber,
                    user.address,
                    user.userType,
                    user.accountStatus
                );
                users.push(userModel);
            }
        } else if (Array.isArray(data)) {
            // If data is an array of users
            for (const user of data) {
                const userModel = new UserModel(
                    user.userId,
                    user.username,
                    user.password,
                    user.fullName,
                    user.email,
                    user.phoneNumber,
                    user.address,
                    user.userType,
                    user.accountStatus
                );
                users.push(userModel);
            }
        } else {
            // Handle other possible data structures
            console.error("Unexpected data structure:", data);
            return [];
        }
        return users;
    } catch (error) {
        console.error("Cannot fetch user list:", error);
        return [];
    }
}
