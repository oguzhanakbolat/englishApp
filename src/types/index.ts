export type CompanyType = {
  id: string;
  name: string;
  taxNumber: string;
  taxOffice: string;
};

export type AddressType = {
  id: string;
  address: string;
  postCode: string;
};

export type ImageType = {
  url: string;
};

export type FollowType = {
  cource: string;
  exercise: string;
  level: string;
};

export type UserType = {
  id: string;
  language: string;
  image: ImageType;
  username: string;
  email: string;
  phone: string;
  company: CompanyType;
  address: AddressType;
  follows: FollowType;
};

export type IconType = {
  name: string;
  size?: number;
  color?: string;
};
