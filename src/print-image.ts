import { promises as fs } from 'fs';

import USBPaperangPrinter from './printer/usb-paperang-printer';
import BluetoothPaperangPrinter from './printer/bluetooth-paperang-printer';
import ConsolePrinter from './printer/console-printer';

import PrintableImage from './printable-image';
import { BergPrinterPrinterPrinter } from './berger/device/printer';

// const printer: BergPrinterPrinterPrinter = new BluetoothPaperangPrinter();
const printer: BergPrinterPrinterPrinter = new BluetoothPaperangPrinter({
  address: '00-15-82-90-1d-76',
  channel: 6,
});

const printImage = async (path: string): Promise<void> => {
  // load file
  const buffer = await fs.readFile(path);

  const image = new PrintableImage(buffer);
  image.dither();

  // print 'em
  await (printer as BergPrinterPrinterPrinter).print(image, undefined);
};

const path = '/Users/joshua/Desktop/Messages Image(3152827289).jpeg';

printImage(path);