const path = require('path');
const Replicate = require('replicate');

require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

async function removeBackground(imageBuffer) {
  try {
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    console.log('=== BG REMOVAL START ===');
    console.log('CALLING REPLICATE BG REMOVAL');

    const output = await replicate.run(
      'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
      {
        input: {
          image: imageUrl,
        },
      }
    );

    console.log('BG REMOVAL OUTPUT:', output);
    console.log('RAW OUTPUT:', output);
    console.log('TYPE:', typeof output);

    let finalImageUrl = null;

    if (Array.isArray(output)) {
      finalImageUrl = output[0];
    } else if (typeof output === 'string') {
      finalImageUrl = output;
    } else if (output?.image) {
      finalImageUrl = output.image;
    }

    console.log('FINAL BG URL:', finalImageUrl);

    return finalImageUrl;
  } catch (error) {
    console.error('BG REMOVE ERROR:', error.message);
    return null;
  }
}

module.exports = { removeBackground };
