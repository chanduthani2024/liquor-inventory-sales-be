import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/user.entity';

export const seedAuthData = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      is_active: true,
    });

    await userRepository.save(adminUser);
    console.log('Default admin user created (username: admin, password: admin123)');
  } else {
    console.log('Admin user already exists');
  }
};