import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/Users';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Email address already used');
    }

    const hasedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hasedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;