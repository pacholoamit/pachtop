export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  last_active: Date;
  opt_in: boolean;
  operating_system: string;
  version: string;
}
export type CreateAppUserInput = Omit<User, "id">;
