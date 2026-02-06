// src/lib/prisma.ts
// Prisma 客户端单例 - 暂时使用mock

// 临时mock，等数据库配置好后替换
const mockPrisma = {
  article: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
  },
  category: {
    findMany: async () => [],
  },
  tag: {
    findMany: async () => [],
  },
  apiKey: {
    findUnique: async () => null,
  },
};

export const prisma = mockPrisma as any;
export default prisma;
