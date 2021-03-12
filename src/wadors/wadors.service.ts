import { Injectable } from '@nestjs/common';
import * as dicomParser from 'dicom-parser';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class WadorsService {
  async serveFile(filePath: string, boundary: string, contentId: string) {
    try {
      const data = await fs.promises.readFile(filePath);
      const dataset = dicomParser.parseDicom(data);
      const pixelDataElement = dataset.elements.x7fe00010;
      const buffer = Buffer.from(
        dataset.byteArray.buffer,
        pixelDataElement.dataOffset,
        pixelDataElement.length,
      );

      const term = '\r\n';
      const endline = `${term}--${boundary}--${term}`;

      const readStream = new Readable({
        read() {
          this.push(`${term}--${boundary}${term}`);
          this.push(`Content-Location:localhost${term}`);
          this.push(`Content-ID:${contentId}${term}`);
          this.push(`Content-Type:application/octet-stream${term}`);
          this.push(term);
          this.push(buffer);
          this.push(endline);
          this.push(null);
        },
      });

      return readStream;
    } catch (error) {
      console.error(error);
    }
  }
}
