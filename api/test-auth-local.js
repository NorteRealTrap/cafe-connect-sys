import { config } from 'dotenv';
config({ path: '.env.development.local' });

import handler from './auth.ts';

const mockReq = {
  method: 'POST',
  headers: { origin: 'http://localhost:5173' },
  body: {
    email: 'admin@cafeconnect.com',
    password: 'admintester12345',
    role: 'admin'
  }
};

const mockRes = {
  status: (code) => {
    console.log('Status:', code);
    return mockRes;
  },
  json: (data) => {
    console.log('Response:', JSON.stringify(data, null, 2));
    return mockRes;
  },
  setHeader: () => mockRes,
  end: () => mockRes
};

handler(mockReq, mockRes);
