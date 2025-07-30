export interface PayloadToken {
  username: string;
  fullName: string;
  role: {
    roleId: string;
    name: string;
  };
}
