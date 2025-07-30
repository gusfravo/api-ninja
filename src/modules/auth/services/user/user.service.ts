import { User } from '@auth/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  onFindByUsername(username: string) {
    return from(
      this.userRepository.findOne({
        where: { username },
        relations: { role: true },
      }),
    );
  }

  create(user: User) {
    return from(this.userRepository.save(user));
  }
}
