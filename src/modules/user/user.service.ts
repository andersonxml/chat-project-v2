import type { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../shared/database/prisma.js";
import type { EditDTO } from "./dto/user.dto.js";
import bcrypt from 'bcrypt'

export class UserService {
    async getAllUsers() {
        const users = await prisma.user.findMany();
        if (users.length === 0) throw new Error('No users found');

        return users.map(user => ({
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
    }

    async editUser(data: EditDTO) {
        if (!data.email) throw new Error('E-mail is required.')


        if (!data.name && !data.password && !data.role) throw new Error('Check the fields.');

        const userExists = await prisma.user.findUnique({ where: { email: data.email } })
        if (!userExists) throw new Error('User not found')
        if (!data.name) {
            data.name = userExists.name
        }

        const update = await prisma.user.update({
            where: {
                email: userExists.email
            },
            data: {
                name: data.name,
                password: data.password ? await bcrypt.hash(data.password, 10) : undefined,
                role: data.role ? data.role.toUpperCase() as Role : undefined,
            }
        });

        return {
            message: 'User updated successfully',
            update
        };
    }

    async deleteUser(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found');

        const deletedUser = await prisma.user.delete({ where: { email } });

        return {
            message: 'User deleted successfully',
            user: {
                name: deletedUser.name,
                email: deletedUser.email,
            }
        };
    }
}