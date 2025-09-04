import p5 from "p5";

const ITER_STEP = 60;
const MIN_THRESHOLD = 64;
const MAX_THRESHOLD = 240;
const MIN_TITLE_TEXT_SIZE = 24;
const MAX_TITLE_TEXT_SIZE = 180;

const sketch = (p: p5) => {
  let bgCol: p5.Color;
  let textEdgeCol: p5.Color;
  let textCol: p5.Color;
  let mouseDistThreshold = 0;
  let drawCol: p5.Color;
  let cursorCol: p5.Color;
  let titleText = "WAVY.";
  let isWavy = true;
  let defaultWaveAmp = ITER_STEP / 2;
  let effectWaveAmp = 0;
  let titleTextSize = 180;
  let mousePosAry: p5.Vector[] = [];
  let stalkerPos: p5.Vector = p.createVector(0, 0);

  // waveStateの変更に応じて色やテキストを設定する関数
  const setModalParams = (waveState: boolean) => {
    if (waveState) {
      drawCol = p.color(50, 50, 200, 40);
      bgCol = p.color(0, 8);
      titleText = "WAVY.";
      defaultWaveAmp = ITER_STEP / 2;
      effectWaveAmp = 0;
    } else {
      drawCol = p.color(10, 100, 20, 40);
      bgCol = p.color(0, 8);
      titleText = "CALM.";
      defaultWaveAmp = 0;
      effectWaveAmp = ITER_STEP / 2;
    }
  };

  /**
   * ポイント1. 三角関数を使った周期的なアニメーション
   */
  const drawWave = (
    step: number,
    threshold: number,
    defaultWaveAmp: number,
    effectWaveAmp: number,
  ) => {
    const ANIMATION_SPEED_RATIO = 0.02;

    // stepずつy軸の方向に走査
    for (let j = 0; j < p.height; j += step) {
      p.beginShape();
      // step/4ずつx軸の正方向に走査
      for (let i = 0; i < p.width; i += step / 4) {
        const x = i;
        const phaseDelay = (i + j) / 2;
        // マウスと基線の距離
        const d = p.dist(p.mouseX, p.mouseY, x, j);
        // 距離に応じて振幅を変化
        let t = p.constrain(d / threshold, 0, 1);
        const n = 10;
        t = p.pow(t, n);
        const localAmp = p.lerp(effectWaveAmp, defaultWaveAmp, t);
        const y =
          localAmp *
            p.sin((p.frameCount - phaseDelay) * ANIMATION_SPEED_RATIO) +
          j;
        p.vertex(x, y);
      }
      p.endShape();
    }
  };

  p.setup = () => {
    // キャンバスや閾値の初期化
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("canvas-container");
    p.strokeCap(p.ROUND);
    mouseDistThreshold = p.constrain(
      p.windowWidth / 6,
      MIN_THRESHOLD,
      MAX_THRESHOLD,
    );
    setModalParams(isWavy);

    // 色の設定
    textEdgeCol = p.color(255);
    textCol = p.color(180, 200);
    drawCol = p.color(50, 50, 200, 40);
    bgCol = p.color(0, 8);
    cursorCol = p.color(200);

    // テキストのスタイル設定
    const currentTextSize = p.constrain(
      p.windowWidth / 6,
      MIN_TITLE_TEXT_SIZE,
      MAX_TITLE_TEXT_SIZE,
    );
    p.textSize(currentTextSize);
    p.textFont("arial");
    p.textStyle(p.BOLDITALIC);
    p.textAlign(p.LEFT, p.BOTTOM);

    p.background(0);
  };

  p.draw = () => {
    p.background(bgCol);
    p.stroke(drawCol);
    p.strokeWeight(1);
    p.fill(drawCol);

    //波の描画
    drawWave(ITER_STEP, mouseDistThreshold, defaultWaveAmp, effectWaveAmp);

    // テキストの描画
    p.strokeWeight(2);
    p.stroke(textEdgeCol);
    p.fill(textCol);
    p.text(titleText, titleTextSize / 6, p.height - titleTextSize / 6);

    /**
     * ポイント2. マウス操作によるエフェクトの変化：カーソル
     */
    // マウスストーカーの太さをカーソルの移動量に合わせて調整
    p.stroke(cursorCol);
    const d = p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
    const sw = p.lerp(1, d / 10, 0.2);
    p.strokeWeight(sw);

    // マウスストーカーを遅らせる
    stalkerPos.x = p.lerp(stalkerPos.x, p.mouseX, 0.2);
    stalkerPos.y = p.lerp(stalkerPos.y, p.mouseY, 0.2);

    // 過去4フレーム分のマウスストーカーの位置を保存して曲線で描画
    mousePosAry.push(stalkerPos.copy());
    if (mousePosAry.length > 4) {
      mousePosAry.shift();
    }

    // マウスストーカーの描画
    p.noFill();
    p.beginShape();
    for (const pos of mousePosAry) {
      p.curveVertex(pos.x, pos.y);
    }
    p.endShape();
  };

  /**
   * ポイント3. 画面サイズ拡縮時の調整
   */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
    mouseDistThreshold = p.constrain(
      p.windowWidth / 6,
      MIN_THRESHOLD,
      MAX_THRESHOLD,
    );
    const currentTextSize = p.constrain(
      p.windowWidth / 6,
      MIN_TITLE_TEXT_SIZE,
      MAX_TITLE_TEXT_SIZE,
    );
    p.textSize(currentTextSize);
  };

  /**
   * ポイント2. マウス操作によるエフェクトの変化：クリック
   */
  p.mouseReleased = () => {
    isWavy = !isWavy;
    setModalParams(isWavy);
  };
};

new p5(sketch);
