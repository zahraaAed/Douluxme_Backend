// src/models/userModel.ts

export interface User {
    id: string;  // Supabase automatically generates an ID
    email: string;
    name: string;
    password?: string;  
    role: 'customer' | 'admin';
    address: {
      phone: string;
      region: string;
      address_direction: string;
      building: string;
      floor: string;
    } | null;
  }
  