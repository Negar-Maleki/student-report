interface Configs {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  customHeaders: {
    Authorization: string;
  };
}

export const configs: Configs = {
  clientID: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  callbackURL: process.env.GITHUB_CALLBACK_URL || "",
  customHeaders: {
    Authorization: `prompt=login`, // Add the prompt to the headers manually
  },
};
