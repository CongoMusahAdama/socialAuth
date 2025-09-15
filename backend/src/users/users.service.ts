import { Injectable } from '@nestjs/common';
import { User, CreateUserDto } from './interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  // In-memory user store for demo purposes
  private users: User[] = [];

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async findByProvider(provider: string, providerId: string): Promise<User | undefined> {
    return this.users.find(user => 
      user.provider === provider && user.providerId === providerId
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      id: uuidv4(),
      ...createUserDto,
      createdAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async findOrCreate(createUserDto: CreateUserDto): Promise<User> {
    // Try to find existing user
    const existingUser = await this.findByProvider(createUserDto.provider, createUserDto.providerId);
    
    if (existingUser) {
      return existingUser;
    }

    // Create new user if not found
    return this.create(createUserDto);
  }

  // For demo purposes - get all users
  async findAll(): Promise<User[]> {
    return this.users;
  }
}
