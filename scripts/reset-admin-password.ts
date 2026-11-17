import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Usage:
//   ADMIN_NEW_PASSWORD=<pw> npx ts-node scripts/reset-admin-password.ts
//   npx ts-node scripts/reset-admin-password.ts <password>
const username = process.env.ADMIN_USERNAME || 'admin';
const newPassword = process.env.ADMIN_NEW_PASSWORD || process.argv[2];

if (!newPassword || newPassword.length < 8) {
  console.error('Provide a new password (min 8 chars) via ADMIN_NEW_PASSWORD env or argv.');
  console.error('Usage: npx ts-node scripts/reset-admin-password.ts <password>');
  process.exit(1);
}

async function resetAdminPassword() {
  console.log('Resetting admin password...');
  console.log('Username:', username);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: { password: hashedPassword },
    create: { username, password: hashedPassword, role: 'super_admin' },
  });

  console.log('✅ Password admin berhasil direset untuk:', admin.username);
  console.log('⚠️  Simpan password ini di tempat aman!');
}

resetAdminPassword()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
