declare module '@prisma/client' {
  export interface User { id: string; role?: string; [key: string]: any }
  export class PrismaClient {
    user: {
      findUnique: (args: { where: { id: string } }) => Promise<User | null>;
      findFirst: (args?: any) => Promise<User | null>;
      create: (args: { data: User }) => Promise<User>;
      update: (args: { where: { id: string }; data: Partial<User> }) => Promise<User | null>;
      delete: (args: { where: { id: string } }) => Promise<User | null>;
    };
    constructor(...args: any[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    __reset?(data?: any): void;
    [key: string]: any;
  }
  export const prisma: PrismaClient;
  const _default: any;
  export default _default;
}
