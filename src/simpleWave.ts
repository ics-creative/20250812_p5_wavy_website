import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.stroke(255);
    p.noFill();
  };

  p.draw = () => {
    p.background(0);

    const centerY = p.height / 2;
    const ratio = 0.03;
    const waveAmp = 40;
    const step = 20;

    p.strokeWeight(1);
    p.stroke(255);
    p.beginShape();
    for (let i = step; i < p.width; i += step) {
      const x = i;
      const y = waveAmp * p.sin(p.frameCount * ratio - i) + centerY;
      p.vertex(x, y);
    }
    p.endShape();

    p.strokeWeight(6);
    for (let i = step; i < p.width; i += step) {
      const x = i;
      const y = waveAmp * p.sin(p.frameCount * ratio - i) + centerY;

      p.stroke("red");
      p.point(x, y);
    }
  };
};

new p5(sketch);
