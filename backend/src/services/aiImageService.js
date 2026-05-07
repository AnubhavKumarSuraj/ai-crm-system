const path = require('path');
const axios = require('axios');
const OpenAI = require('openai');
const { toFile } = require('openai');

require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { uploadToSupabase } = require('./storageService');

const MARKETING_PROMPT = `Create a premium high-converting marketing advertisement poster using the uploaded product image as inspiration.

Transform the product into a professional commercial-quality ad creative that looks like luxury commercial photography or an award-winning ecommerce campaign.

PRODUCT SCALE:
- The product must occupy 50–70% of the frame height
- The product is the dominant visual element
- No excessive empty space around it
- Make the product appear large, close, premium, and visually commanding

CREATIVE FREEDOM:
You may freely:
- redesign the composition and camera angle
- add luxury environments, studio backdrops, or abstract premium settings
- add cinematic depth of field and dramatic shadows
- add studio lighting, rim lighting, or volumetric light
- add glow effects, floating particles, lens flares
- add glossy reflections and premium surface textures
- add luxury lifestyle context or abstract brand aesthetics
- choose any layout, visual hierarchy, and typographic style

VISUAL QUALITY DIRECTION:
- Ultra realistic luxury commercial photography
- Cinematic studio lighting with dramatic contrast
- Premium product advertising aesthetic
- High-end branding and premium visual identity
- Glossy reflections and photorealistic materials
- Art-directed advertisement with intentional composition
- Award-winning ad photography quality

TEXT AND TYPOGRAPHY:
Typography, text position, font style, and layout are entirely your creative choice.

Include:
- a visible discount or promotional offer (e.g. "20% OFF" or equivalent)
- premium marketing copy that feels like a luxury brand tagline
- strong typographic hierarchy that enhances the premium feel

FINAL RESULT:
The image must feel like a modern luxury Instagram advertisement or premium ecommerce campaign — professionally art-directed, visually striking, and immediately compelling.`;

async function generateMarketingImage(imageUrl) {
  console.log('USING NEW AI-FIRST PROMPT');
  console.log('USING ORIGINAL IMAGE FOR OPENAI');
  console.log('CALLING OPENAI IMAGE API');
  console.log('INPUT IMAGE URL:', imageUrl);

  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const imageBuffer = Buffer.from(response.data);
  const imageFile = await toFile(imageBuffer, 'product.png', { type: 'image/png' });

  console.log('OPENAI IMAGE GENERATION START');
  const result = await openai.images.edit({
    model: 'gpt-image-1',
    image: imageFile,
    prompt: MARKETING_PROMPT,
    size: '1024x1536',
  });

  console.log('OPENAI GENERATION SUCCESS');
  console.log('NO TEMPLATE FALLBACK USED');

  const b64 = result.data[0]?.b64_json;
  if (!b64) {
    throw new Error('OpenAI returned no image data');
  }

  const finalBuffer = Buffer.from(b64, 'base64');
  const finalUrl = await uploadToSupabase(finalBuffer, 'ai-marketing.png', 'image/png');

  console.log('FINAL AI URL:', finalUrl);
  return finalUrl;
}

module.exports = { generateMarketingImage };
