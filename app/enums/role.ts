export enum UserType {
  USER = 'user',
  BUSINESS_OWNER = 'business_owner',
  ADMIN = 'admin',
}

export type RegisterUserType = UserType.USER | UserType.BUSINESS_OWNER
