/**
 * Generates Android launcher icons (square + round) from assets/logo.png
 * onto the brand cream background, for all mipmap densities.
 */
const Jimp = require('jimp');
const path = require('path');

const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');

const CREAM = Jimp.rgbaToInt(243, 232, 215, 255); // #F3E8D7

const densities = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

(async () => {
  const logo = await Jimp.read(logoPath);

  for (const [name, size] of Object.entries(densities)) {
    // logo scaled to ~70% of the icon, centered on cream
    const mark = logo.clone().resize(Math.round(size * 0.72), Jimp.AUTO);

    // square icon
    const square = new Jimp(size, size, CREAM);
    square.composite(
      mark,
      Math.round((size - mark.bitmap.width) / 2),
      Math.round((size - mark.bitmap.height) / 2),
    );
    await square.writeAsync(path.join(resDir, `mipmap-${name}`, 'ic_launcher.png'));

    // round icon — circular cream mask
    const round = new Jimp(size, size, 0x00000000);
    const r = size / 2;
    round.scan(0, 0, size, size, function (x, y, idx) {
      const dx = x - r + 0.5;
      const dy = y - r + 0.5;
      if (dx * dx + dy * dy <= r * r) {
        this.bitmap.data[idx] = 243;
        this.bitmap.data[idx + 1] = 232;
        this.bitmap.data[idx + 2] = 215;
        this.bitmap.data[idx + 3] = 255;
      }
    });
    round.composite(
      mark,
      Math.round((size - mark.bitmap.width) / 2),
      Math.round((size - mark.bitmap.height) / 2),
    );
    await round.writeAsync(path.join(resDir, `mipmap-${name}`, 'ic_launcher_round.png'));

    console.log(`✓ ${name}: ${size}x${size} (square + round)`);
  }

  console.log('Launcher icons generated.');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
