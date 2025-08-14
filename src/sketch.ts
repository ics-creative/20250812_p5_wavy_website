import p5 from "p5";


const sketch = (p: p5) => {
    const ITER_STEP = 60;
    const TITLE_TEXT_SIZE = 180;
    let mouseDistThreshold;
    let drawCol, bgCol, textCol, textFillCol, textEdgeCol, cursorCol;
    let titleText = "WAVY.";
    let titleWidth;
    let isWavy = true;
    let waveAmp = ITER_STEP / 3;

    // waveStateの変更に応じて色やテキストを設定する関数
    const setModalParams = (waveState: boolean) => {
        if (waveState) {
            drawCol = p.color(50, 0, 200, 40);
            cursorCol = p.color(255, 0, 0, 255);
            titleText = "WAVY.";
            waveAmp = ITER_STEP / 3;
        } else {
            drawCol = p.color(200, 0, 50, 40);
            cursorCol = p.color(100, 0, 250);
            titleText = "SILENCE.";
            waveAmp = 2;
        }
    }

    const drawWave = (step: number, threshold: number, waveAmp: number) => {
        const tRatio = 0.03;
        for (let j = step/3; j < p.height; j+=step) {
            p.beginShape();
            for (let i = -step; i < p.width + step*2; i+=step) {
                const x = i;
                const phaseDelay = (i + j) / 2;

                let y = waveAmp * p.sin((p.frameCount - phaseDelay) * tRatio) + j;
                const mouseDist = p.dist(p.mouseX, p.mouseY, x, y);
                if (mouseDist < threshold) {
                    if (isWavy) {
                        y = j;
                    } else {
                        y = step / 3 * p.sin((p.frameCount - phaseDelay) * tRatio) + j;
                    }
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
        mouseDistThreshold = p.windowWidth / 6;
        setModalParams(isWavy);

        // 色の設定
        bgCol = p.color(0, 8);
        textEdgeCol = p.color(255);
        textCol = p.color(180, 200);
        textFillCol = p.color(200, 0, 100, 40);

        // テキストのスタイル設定
        p.textSize(TITLE_TEXT_SIZE);
        p.textFont('arial');
        p.textStyle(p.BOLDITALIC);
        p.textAlign(p.LEFT, p.BOTTOM);
        titleWidth = p.textWidth(titleText);
    };

    p.draw = () => {
        p.background(bgCol);
        p.stroke(drawCol);
        p.strokeWeight(1);
        p.fill(drawCol);

        //波の描画
        drawWave(ITER_STEP, mouseDistThreshold, waveAmp);

        // テキストの描画
        p.strokeWeight(2);
        p.stroke(textEdgeCol);
        p.fill(textCol);
        p.text(titleText, TITLE_TEXT_SIZE / 6, p.height - TITLE_TEXT_SIZE / 6);

        // マウスカーソルの描画
        p.stroke(cursorCol);
        p.strokeWeight(2);
        p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        mouseDistThreshold = p.windowWidth / 6;
    }

    p.mouseReleased = () => {
        isWavy = !isWavy;
        setModalParams(isWavy);
    }
};

new p5(sketch);