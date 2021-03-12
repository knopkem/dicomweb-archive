import { Injectable } from '@nestjs/common';
import * as dicomParser from 'dicom-parser';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class WadorsService {
  async serveFile(
    req: any,
    filePath: string,
    boundary: string,
    contentId: string,
  ) {
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

      const readStream = new Readable();
      readStream.push(`${term}--${boundary}${term}`);
      readStream.push(`Content-Location:localhost${term}`);
      readStream.push(`Content-ID:${contentId}${term}`);
      readStream.push(`Content-Type:application/octet-stream${term}`);
      readStream.push(term);
      readStream.push(buffer);
      readStream.push(endline);
      readStream.push(null);

      readStream.on('error', (data: any) => {
        console.error(data);
      });
      readStream.on('data', (data: any) => {
        if (data) {
          req.write(data);
        }
      });
      readStream.on('end', () => {
        req.send();
      });
      readStream.read();
    } catch (error) {
      console.error(error);
    }
  }
}
