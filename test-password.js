import bcryptjs from 'bcryptjs';

const hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkI0qQcO8K3m';
const password = '123456';

async function testPassword() {
  try {
    const isValid = await bcryptjs.compare(password, hash);
    console.log('Password "123456" matches hash:', isValid);
  } catch (error) {
    console.error('Error:', error);
  }
}

testPassword();