import bwipjs from 'bwip-js';
import sharp from 'sharp';
export const generateBarcodeWebp = async (text) => {
  const pngBuffer = await bwipjs.toBuffer({
    bcid: 'code128', 
    text, 
    scale: 4,
    height: 12,
    includetext: true,
    textxalign: 'center'
  });

  return await sharp(pngBuffer).webp({ quality: 90 }).toBuffer();
}
