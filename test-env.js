// Test which DATABASE_URL is being loaded
require('dotenv').config();

console.log('=== Environment Variables ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Try to extract just the host part
const url = process.env.DATABASE_URL;
if (url) {
  const hostMatch = url.match(/@([^:/]+)/);
  console.log('Host:', hostMatch ? hostMatch[1] : 'NOT FOUND');
}
