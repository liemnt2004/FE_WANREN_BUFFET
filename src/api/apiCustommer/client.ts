import { createClient } from 'contentful';

const client = createClient({
  space: 'zqt33733r6qz', // Thay bằng Space ID
  accessToken: 'QL4I_ZuITyf2uBLhOutKVEoR5_Bg6oBATqQQLSqu7go', // Thay bằng Access Token
});

export default client;
