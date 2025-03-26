import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  
  async findAll(): Promise<User[]> {
    return await this.userRepository.find(); // Fetch all users
  }

   // ✅ Update method to support updating user details (e.g., refreshToken)
   async update(id: number, data: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, data);
    return await this.userRepository.findOne({ where: { id } }); // Return User or null
  }  


  
}
