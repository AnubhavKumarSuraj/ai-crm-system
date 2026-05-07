const sharp = require('sharp');

const W = 800;
const H = 1000;
const PRODUCT_SIZE = 460;
const PRODUCT_X = (W - PRODUCT_SIZE) / 2;
const PRODUCT_Y = 220;

async function composeMarketingImage(buffer) {
  const bgSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#0f0c29" />
        <stop offset="50%"  stop-color="#302b63" />
        <stop offset="100%" stop-color="#24243e" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="52%" r="38%">
        <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#0f0c29" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)" />
    <ellipse cx="${W / 2}" cy="${H * 0.52}" rx="310" ry="270" fill="url(#glow)" />
  </svg>`;

  const shadowSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blur">
        <feGaussianBlur stdDeviation="20" />
      </filter>
    </defs>
    <ellipse
      cx="${W / 2}" cy="${PRODUCT_Y + PRODUCT_SIZE - 10}"
      rx="${PRODUCT_SIZE * 0.38}" ry="22"
      fill="rgba(0,0,0,0.65)" filter="url(#blur)" />
  </svg>`;

  const topTextSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text
      x="${W / 2}" y="108"
      font-family="Arial Black, Arial, sans-serif"
      font-size="54" font-weight="900"
      fill="#FFD700"
      text-anchor="middle" dominant-baseline="middle"
      letter-spacing="2">
      &#x1F525; 20% OFF
    </text>
    <line x1="${W / 2 - 180}" y1="140" x2="${W / 2 + 180}" y2="140"
          stroke="#7c3aed" stroke-width="1.5" opacity="0.6" />
  </svg>`;

  const bottomTextSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <line x1="${W / 2 - 160}" y1="790" x2="${W / 2 + 160}" y2="790"
          stroke="#7c3aed" stroke-width="1.5" opacity="0.7" />
    <text
      x="${W / 2}" y="836"
      font-family="Arial Black, Arial, sans-serif"
      font-size="34" font-weight="900"
      fill="#FFFFFF"
      text-anchor="middle" dominant-baseline="middle"
      letter-spacing="5">
      PREMIUM COLLECTION
    </text>
    <text
      x="${W / 2}" y="890"
      font-family="Arial, sans-serif"
      font-size="22"
      fill="#a78bfa"
      text-anchor="middle" dominant-baseline="middle"
      letter-spacing="3">
      LIMITED TIME OFFER
    </text>
    <line x1="${W / 2 - 110}" y1="920" x2="${W / 2 + 110}" y2="920"
          stroke="#7c3aed" stroke-width="1" opacity="0.5" />
  </svg>`;

  const product = await sharp(buffer)
    .resize(PRODUCT_SIZE, PRODUCT_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const background = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  return sharp(background)
    .composite([
      { input: Buffer.from(shadowSvg) },
      { input: product, top: PRODUCT_Y, left: PRODUCT_X },
      { input: Buffer.from(topTextSvg) },
      { input: Buffer.from(bottomTextSvg) },
    ])
    .png()
    .toBuffer();
}

module.exports = { composeMarketingImage };
