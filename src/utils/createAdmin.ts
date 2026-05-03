/**
 * Run once to create an admin user:
 * npx tsx src/utils/createAdmin.ts
 */
import dotenv from 'dotenv';
import connectDB from '../config/db.ts';
import User from '../models/user.model.ts';

dotenv.config();

async function createAdmin() {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@travelai.com' });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log('✅ Existing user promoted to admin:', existing.email);
  } else {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@travelai.com',
      password: 'Admin123!',
      role: 'admin',
    });
    console.log('✅ Admin created:', admin.email);
    console.log('   Password: Admin123!');
  }

  process.exit(0);
}

createAdmin().catch((e) => { console.error(e); process.exit(1); });
