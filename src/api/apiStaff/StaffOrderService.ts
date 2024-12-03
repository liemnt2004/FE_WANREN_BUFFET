// StaffOrderService.ts
import axios from 'axios';
import { StaffOrderDTO } from '../../models/StaffModels/Type';

const API_URL = 'https://wanrenbuffet.online/api/StaffOrders';

export const StaffOrderService = {
  createOrder: async (orderData: StaffOrderDTO.OrderWithDetailsRequest) => {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  },
  // Other methods ...
};
