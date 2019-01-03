/* eslint-disable no-param-reassign */

const sketch = p => {
  let x = 100;
  let y = 100;

  let red;
  let green;
  let blue;

  let isPainting;
  let isRandom;
  let shouldSketchReset;

  let maxDots;
  let dots = 0;

  p.redrawHandler = sketchValues => {
    ({ red, green, blue, maxDots, isPainting, isRandom, shouldSketchReset } = sketchValues);
  };

  p.resetSketch = resetSketch => {
    dots = 0;
    p.clear();
    p.setup();
  };

  p.setup = () => {
    p.createCanvas(600, 600);
    p.background(51);
    p.frameRate(60);
  };

  p.draw = () => {
    if (shouldSketchReset) {
      p.resetSketch();
      p.updateStateHandler({ dots, shouldSketchReset: false });
    }
    if (isPainting) {
      p.fill(red, green, blue, 100);
      p.noStroke();

      x = p.random(0, 600);
      y = p.random(0, 600);

      p.ellipse(x, y, 32, 32);

      dots += 1;

      p.updateStateHandler({
        dots
      });

      if (isRandom) {
        p.updateStateHandler({
          red: p.random(255),
          green: p.random(255),
          blue: p.random(255)
        });
      }

      if (dots >= maxDots) {
        p.updateStateHandler({ isPainting: false });
      }
    }
  };
};

export default sketch;
