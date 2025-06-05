import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Disable foreign key checks to allow cascading deletes
    await this.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

    const tablenames = await this.$queryRaw<
      Array<{ TABLE_NAME: string }>
    >`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = 'social_media';`;

    // Delete all records from all tables
    for (const { TABLE_NAME } of tablenames) {
      if (TABLE_NAME !== '_prisma_migrations') {
        try {
          await this.$executeRaw(`TRUNCATE \`${TABLE_NAME}\`;`);
        } catch (error) {
          console.log({ error });
        }
      }
    }

    // Re-enable foreign key checks
    await this.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
  }
}