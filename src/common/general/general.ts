import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export class General {
  static generateId() {
    return uuidv4();
  }

  static hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
