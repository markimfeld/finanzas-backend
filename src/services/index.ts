import { UserService } from './user.service';
import { UserRepositoryMongo } from '../repositories/implementations/user.repository.mongo';

const userRepository = new UserRepositoryMongo();
export const userService = new UserService(userRepository);
