import 'dotenv/config';
import { PrismaClient } from './app/generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from './lib/auth';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL tidak ditemukan di environment variable.');
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  await prisma.$connect();

  // 1. Seed Categories
  console.log('Seeding categories...');
  const categories = [
    { code: 'KRS', name: 'Kursi' },
    { code: 'MJA', name: 'Meja' },
    { code: 'LMP', name: 'Lampu' },
    { code: 'RAK', name: 'Rak Penyimpanan' },
    { code: 'ALT', name: 'Alat Kantor' },
    { code: 'ELK', name: 'Elektronik' },
    { code: 'KMP', name: 'Komputer & Aksesoris' },
    { code: 'ATK', name: 'Alat Tulis Kantor' },
  ];

  for (const cat of categories) {
    await prisma.itemCategory.upsert({
      where: { code: cat.code },
      update: { name: cat.name },
      create: { ...cat, isActive: true },
    });
  }

  // 2. Seed Warehouses & Grids
  console.log('Seeding warehouses and grids...');
  const warehouseConfigs = [
    { name: 'Gudang Utama', rows: 4, cols: 3, prefix: 'G1' },
    { name: 'Gudang Cadangan', rows: 3, cols: 3, prefix: 'G2' },
  ];

  for (const config of warehouseConfigs) {
    let warehouse = await prisma.warehouse.findFirst({
      where: { name: config.name },
    });

    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: {
          name: config.name,
          rows: config.rows,
          cols: config.cols,
        },
      });
    }

    for (let r = 1; r <= config.rows; r += 1) {
      for (let c = 1; c <= config.cols; c += 1) {
        const code = `${config.prefix}-R${r}-C${c}`;
        await prisma.grid.upsert({
          where: { code },
          update: {
            warehouseId: warehouse.id,
            row: r,
            col: c,
          },
          create: {
            code,
            warehouseId: warehouse.id,
            row: r,
            col: c,
            isActive: true,
          },
        });
      }
    }
  }

  // 3. Seed Users
  console.log('Seeding users...');
  const users = [
    {
      name: 'Administrator Utama',
      email: 'admin@gudang.com',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
    },
    {
      name: 'Petugas Lapangan',
      email: 'petugas@gudang.com',
      passwordHash: hashPassword('petugas123'),
      role: 'petugas',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash: u.passwordHash,
        role: u.role,
      },
      create: u,
    });
  }

  await prisma.$disconnect();
  await pool.end();
  console.log('✅ Database seeding completed successfully.');
}

main().catch((e) => {
  console.error('❌ Database seeding failed:', e);
  process.exit(1);
});