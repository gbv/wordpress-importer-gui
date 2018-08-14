import {Injectable} from '@angular/core';
import {Md5} from "ts-md5";

@Injectable({
  providedIn: 'root'
})
export class Md5Service {

  constructor() {
  }

  md5File(file: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const CHUNK_SIZE = 1024 * 1024;
      const chunks = Math.ceil(file.size / CHUNK_SIZE);
      const fileReader = new FileReader();
      const md5 = new Md5();
      const readerState = {chunk: 0, start: 0, end: Math.min(file.size, CHUNK_SIZE)};

      fileReader.onload = (e: ProgressEvent) => {
        md5.appendByteArray(new Uint8Array(fileReader.result));
        readerState.chunk++;
        if (readerState.chunk < chunks) {
          readerState.start = readerState.chunk * CHUNK_SIZE;
          readerState.end = ((readerState.start + CHUNK_SIZE) >= file.size) ? file.size : readerState.start + CHUNK_SIZE;
        } else {
          const md5sum = <string>md5.end(); // compute hash
          resolve(md5sum);
        }
      };

      fileReader.onerror = () => {
        reject("Error while calculating MD5 sum!");
      };
      fileReader.readAsArrayBuffer(file.slice(readerState.start, readerState.end));
    });
  }
}
