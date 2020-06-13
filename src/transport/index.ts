import Bluetooth, { BluetoothTransportConfiguration } from './bluetooth';
import USB, { USBTransportConfiguration } from './usb';
import TTL, { TTLTransportConfiguration } from './ttl';

export interface TransportAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  write(bytes: Buffer): Promise<void>;
  read(): Promise<Buffer>;
}

export type TransportConfiguration =
  | BluetoothTransportConfiguration
  | USBTransportConfiguration
  | TTLTransportConfiguration;

const makeTransportAdapter = (
  configuration: TransportConfiguration
): TransportAdapter => {
  switch (configuration.type) {
    case 'usb':
      return new USB(configuration.parameters);
    case 'bluetooth':
      return new Bluetooth(configuration.parameters);
    case 'ttl':
      return new TTL(configuration.parameters);
  }
};

export { makeTransportAdapter };
