// src/models/Tablee.ts

export interface Tables {
    tableId: number;            // Corresponds to the table_id in your database
    tableNumber: number;        // Corresponds to the table_number
    tableStatus: string;        // Corresponds to the table_status (you can use an enum type if needed)
    location: string;           // Corresponds to the location
  }
  