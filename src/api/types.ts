export interface User {
  email: string;
  first_name: string;
  last_name: string;
  last_active: Date;
  opt_in: boolean;
  operating_system: string;
}
export type CreateAppUserInput = Omit<User, "id">;
