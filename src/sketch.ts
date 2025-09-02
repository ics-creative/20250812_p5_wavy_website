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

    // waveStateの変更に応じて色やテキストを設定する関数
    const setModalParams = (waveState: boolean) => {
        if (waveState) {
            drawCol = p.color(50, 0, 200, 40);
            cursorCol = p.color(255, 0, 0, 255);
            titleText = "WAVY.";
            defaultWaveAmp = ITER_STEP / 2;
            effectWaveAmp = 0;
        } else {
            drawCol = p.color(200, 0, 50, 40);
            cursorCol = p.color(100, 0, 250, 255);
            titleText = "SILENCE.";
            defaultWaveAmp = 0;
            effectWaveAmp = ITER_STEP / 2;
        }
    }

    /**
     * ポイント1. 三角関数を使った周期的なアニメーション
     */
    const drawWave = (step: number, threshold: number, defaultWaveAmp: number, effectWaveAmp: number) => {
        const ANIMATION_SPEED_RATIO = 0.02;
        for (let j = step/3; j < p.height; j+=step) {
            p.beginShape();
            for (let i = -step; i < p.width + step; i+=step/4) {
                const x = i;
                const phaseDelay = (i + j) / 2;

                let y = defaultWaveAmp * p.sin((p.frameCount - phaseDelay) * ANIMATION_SPEED_RATIO) + j;
                /**
                 * ポイント2. マウス操作によるエフェクトの変化：距離
                 */
                const mouseDist = p.dist(p.mouseX, p.mouseY, x, y);
                if (mouseDist < threshold) {
                    y = effectWaveAmp * p.sin((p.frameCount - phaseDelay) * ANIMATION_SPEED_RATIO) + j;
                }
                p.vertex(x, y);
            }
            p.endShape();
        }
    }

    p.setup = () => {
        // キャンバスや閾値の初期化
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('canvas-container');
        p.noCursor();
        mouseDistThreshold = p.constrain(p.windowWidth / 6, MIN_THRESHOLD, MAX_THRESHOLD);
        setModalParams(isWavy);

        // 色の設定
        textEdgeCol = p.color(255);
        textCol = p.color(180, 200);
        drawCol = p.color(50, 0, 200, 40);
        cursorCol = p.color(255, 0, 0, 255);
        bgCol = p.color(0, 0, 0,8);

        // テキストのスタイル設定
        const currentTextSize = p.constrain(p.windowWidth / 6, MIN_TITLE_TEXT_SIZE, MAX_TITLE_TEXT_SIZE);
        p.textSize(currentTextSize);
        p.textFont('arial');
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
        p.stroke(cursorCol);
        p.strokeWeight(2);
        p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
    };


    /**
     * ポイント3. 画面サイズ拡縮時の調整
     */
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
        mouseDistThreshold = p.constrain(p.windowWidth / 6, MIN_THRESHOLD, MAX_THRESHOLD);
        const currentTextSize = p.constrain(p.windowWidth / 6, MIN_TITLE_TEXT_SIZE, MAX_TITLE_TEXT_SIZE);
        p.textSize(currentTextSize);
    }

    /**
     * ポイント2. マウス操作によるエフェクトの変化：クリック
     */
    p.mouseReleased = () => {
        isWavy = !isWavy;
        setModalParams(isWavy);
    }
};

new p5(sketch);