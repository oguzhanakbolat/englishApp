type Env = {
  isTest: boolean;
  apiURL: string;
  cdnURL: string;
};

const env: Env = {
  isTest: true,
  apiURL: "https://api.example.com",
  cdnURL: "https://cdn.example.com",
};

export default env;
