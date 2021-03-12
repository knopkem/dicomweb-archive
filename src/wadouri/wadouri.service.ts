import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class WadouriService {
  async serveFile(filePath: string) {
    // read file from file system
    return await fs.promises.readFile(filePath);
  }
}
