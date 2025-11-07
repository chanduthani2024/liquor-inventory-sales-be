"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAuthData = void 0;
const bcrypt = require("bcrypt");
const user_entity_1 = require("../auth/user.entity");
const seedAuthData = async (dataSource) => {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const existingAdmin = await userRepository.findOne({
        where: { username: 'admin' }
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = userRepository.create({
            username: 'admin',
            password: hashedPassword,
            is_active: true,
        });
        await userRepository.save(adminUser);
        console.log('Default admin user created (username: admin, password: admin123)');
    }
    else {
        console.log('Admin user already exists');
    }
};
exports.seedAuthData = seedAuthData;
//# sourceMappingURL=seed-auth.js.map