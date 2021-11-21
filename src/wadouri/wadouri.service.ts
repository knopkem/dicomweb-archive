import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class WadouriService {

  /**
   * read while p10 file and return buffer
   * @param filePath 
   * @returns 
   */
  async getFileBufferFromFile(filePath: string): Promise<Buffer> {
    // read file from file system
    return fs.promises.readFile(filePath);
  }

  /**
   * build readable stream from buffer
   * @param buffer 
   * @returns 
   */
  getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }
}
