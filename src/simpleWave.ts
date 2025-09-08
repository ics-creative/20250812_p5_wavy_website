import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.stroke(0);
    p.noFill();
  };

  p.draw = () => {
    p.background(255);

    const centerY = p.height / 2;
    const ratio = 0.03;
    const waveAmp = 40;
    const step = 20;

    p.strokeWeight(1);
    p.stroke(0);
    p.beginShape();
    for (let i = 0; i < p.width; i += step) {
      const x = i;
      const y = waveAmp * p.sin(p.frameCount * ratio - i) + centerY;
      p.curveVertex(x, y);
    }
    p.endShape();

    p.strokeWeight(6);
    for (let i = step; i < p.width - step; i += step) {
      const x = i;
      const y = waveAmp * p.sin(p.frameCount * ratio - i) + centerY;

      p.stroke("#7C71F6");
      p.point(x, y);
    }
  };
};

new p5(sketch);
