export const ProviderEnum = {
  GOOGLE: "GOOGLE",
  X: "X",
  GITHUB: "GITHUB",
  FACEBOOK: "FACEBOOK",
  EMAIL: "EMAIL",
};

export type ProviderEnumType = keyof typeof ProviderEnum;
