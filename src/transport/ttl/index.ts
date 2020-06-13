import SerialPort from 'serialport';

import { TransportAdapter } from '../index';
import logger from '../../logger';

export type TTLParameters = {
  path: string;
  baud: number;
  shouldConfigurePrintSettings: boolean;
};

export type TTLTransportConfiguration = {
  type: 'ttl';
  parameters: TTLParameters;
};

export default class implements TransportAdapter {
  private parameters: TTLParameters;

  private port: SerialPort | undefined;

  constructor(parameters: TTLParameters) {
    this.parameters = parameters;
  }

  async connect(): Promise<void> {
    if (this.parameters.path == null) {
      throw new Error(
        'scanning for printers not supported, you must supply a "path"'
      );
    }

    const shouldConfigurePrintSettings =
      this.parameters.shouldConfigurePrintSettings || false;

    return new Promise((resolve, reject) => {
      logger.info(
        '...connecting serial (path: %s, baud: %d)',
        this.parameters.path,
        this.parameters.baud
      );

      this.port = new SerialPort(
        this.parameters.path,
        {
          baudRate: this.parameters.baud,
        },
        (error) => {
          if (error) {
            logger.error('could not open: %s', error);
            reject(error);
            return;
          }

          logger.info(
            '...opened serial (path: %s, baud: %d)',
            this.port?.path,
            this.port?.baudRate
          );

          if (shouldConfigurePrintSettings && this.port) {
            logger.info('...sending print settings');

            // prettier-ignore
            const settings = [
              0x1d, 0x73, 0x03, 0xe8, // max printer speed
              0x1d, 0x61, 0xd0, // printer acceleration
              0x1d, 0x2f, 0x0f, // peak current
              0x1d, 0x44, 0x80, // max intensity
            ];

            this.port.write(settings, () => {
              resolve();
            });
          } else {
            resolve();
          }
        }
      );

      this.port.on('error', (error) => {
        logger.error('serial error: %s', error);
      });
    });
  }

  async disconnect(): Promise<void> {
    console.log('TTL disconnect');

    if (this.port == null) {
      throw new Error('"port" not set');
    }

    this.port.close();
    this.port = undefined;
  }

  async write(buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.port == null) {
        throw new Error('"port" not set');
      }

      this.port.write(buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async read(): Promise<Buffer> {
    console.log('TTL read');

    // if (this.in == null) {
    //   throw new Error('"in" endpoint not set');
    // }
    // return new Promise((resolve, reject) => {
    //   if (this.in == null) {
    //     return reject(new Error('"in" endpoint not set'));
    //   }
    //   const listener = (buffer: Buffer): void => {
    //     // if there's an empty buffer, let's skip and resubscribe until there's data
    //     if (buffer.length === 0) {
    //       this.in?.once('data', listener);
    //       return;
    //     }
    //     resolve(buffer);
    //   };
    //   this.in.once('data', listener);
    // });
    return new Buffer('');
  }
}
