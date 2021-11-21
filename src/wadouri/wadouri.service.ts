import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class WadouriService {
  async getFileBufferFromFile(filePath: string): Promise<Buffer> {
    // read file from file system
    return fs.promises.readFile(filePath);
  }
  getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();
  
    stream.push(buffer);
    stream.push(null);
  
    return stream;
  }
}
