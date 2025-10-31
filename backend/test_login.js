const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@campus.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('\n📧 Email:', admin.email);
    console.log('🔑 Stored password hash:', admin.password.substring(0, 20) + '...');
    
    // Test password comparison
    const testPassword = 'password123';
    const isMatch = await admin.comparePassword(testPassword);
    console.log(`\n🧪 Testing password "${testPassword}":`, isMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    // Also test with bcrypt.compare directly
    const directMatch = await bcrypt.compare(testPassword, admin.password);
    console.log(`🧪 Direct bcrypt test:`, directMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    // Check if password is already hashed
    const isHashed = admin.password.startsWith('$2');
    console.log(`\n🔐 Password appears to be hashed:`, isHashed ? '✅ YES' : '❌ NO (plain text!)');
    
    if (!isHashed) {
      console.log('\n⚠️  PASSWORD IS NOT HASHED! Re-running seed script will fix this.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();
