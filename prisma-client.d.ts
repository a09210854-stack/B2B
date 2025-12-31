declare module '@prisma/client' {
  export interface User { id: string; role?: string; [key: string]: any }
  export interface Order { id: string; userId: string; amount?: number; [key: string]: any }
  export interface Payment { id: string; orderId: string; status?: string; [key: string]: any }

  export class PrismaClient {
    user: {
      findUnique: (args: { where: { id: string } }) => Promise<User | null>;
      findFirst: (args?: any) => Promise<User | null>;
      create: (args: { data: User }) => Promise<User>;
      update: (args: { where: { id: string }; data: Partial<User> }) => Promise<User | null>;
      delete: (args: { where: { id: string } }) => Promise<User | null>;
    };
    order: {
      create: (args: { data: Order }) => Promise<Order>;
      findUnique: (args: { where: { id: string } }) => Promise<Order | null>;
      findMany: (args?: any) => Promise<Order[]>;
    };
    payment: {
      create: (args: { data: Payment }) => Promise<Payment>;
      findUnique: (args: { where: { id: string } }) => Promise<Payment | null>;
      findMany: (args?: any) => Promise<Payment[]>;
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
