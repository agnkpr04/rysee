import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npx ts-node scripts/generate-hash.ts <password>');
  process.exit(1);
}

console.log('Hash:', bcrypt.hashSync(password, 10));
