import { v2 as cloudinary } from 'cloudinary';

// To avoid TypeScript errors on process.env.* make sure you have a type definition for your env variables
// For example, in a `global.d.ts` file or using an ENV typing library:
// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       CLOUDINARY_CLOUD_NAME: string;
//       CLOUDINARY_API_KEY: string;
//       CLOUDINARY_API_SECRET: string;
//     }
//   }
// }

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
});

export default cloudinary;
