#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🏗️  Setting up ApniSec database...\n');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push schema to database
  console.log('🗄️  Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log('\n✅ Database setup complete!');
  console.log('\n🚀 You can now run: npm run dev');
  
} catch (error) {
  console.error('\n❌ Database setup failed:');
  console.error(error.message);
  process.exit(1);
}