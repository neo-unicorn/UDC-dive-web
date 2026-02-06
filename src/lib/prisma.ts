// src/lib/prisma.ts
// Prisma 客户端桩代码（生产环境需运行 prisma generate）

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockPrisma = (): any => {
  const mockHandler = {
    get: () => () => Promise.resolve([]),
  };
  return new Proxy({}, {
    get: () => new Proxy({}, mockHandler),
  });
};

let prismaInstance: ReturnType<typeof createMockPrisma>;

try {
  // 尝试导入真实的 PrismaClient
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as { prisma: typeof PrismaClient | undefined };
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
} catch {
  // Prisma Client 未生成，使用 mock
  console.warn('Prisma Client not generated. Using mock. Run: npx prisma generate');
  prismaInstance = createMockPrisma();
}

export const prisma = prismaInstance;
export default prisma;
