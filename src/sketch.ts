import p5 from "p5";


const sketch = (p: p5) => {
    const ITER_STEP = 60;
    const TITLE_TEXT_SIZE = 180;
    let drawCol, bgCol, textCol, textFillCol, textEdgeCol, cursorCol;
    let titleText = "WAVY.";
    let titleWidth = 0;
    let MOUSE_DIST_THRESHOLD = p.windowWidth/6;
    let isWavy = true;

    // クリックによって色やテキストを切り替える
    const toggleViewSettings = (waveState: boolean) => {
        if (waveState) {
            drawCol = p.color(50, 0, 200, 40);
            cursorCol = p.color(255, 0, 0, 255);
            titleText = "WAVY.";
        } else {
            drawCol = p.color(200, 0, 50, 40);
            cursorCol = p.color(100, 0, 250);
            titleText = "SILENCE.";
        }
    }

    const drawWave = (step: number, threshold: number) => {
        for (let j = step/3; j < p.height; j+=step) {
            p.beginShape();
            for (let i = -step; i < p.width + step*2; i+=step) {
                const x = i;
                const phaseDelay = (i + j) / 2;
                let amp = 0;
                if (isWavy) {
                    amp = step / 3;
                } else {
                    amp = 2;
                }

                let y = amp * p.sin((p.frameCount - phaseDelay) * 0.03) + j;
                const mouseDist = p.dist(p.mouseX, p.mouseY, x, y);
                if (mouseDist < threshold) {
                    if (isWavy) {
                        y = j;
                    } else {
                        y = step / 3 * p.sin((p.frameCount - phaseDelay) * 0.03) + j;
                    }
                }
                p.vertex(x, y);
            }
            p.endShape();
        }
    }

    p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('canvas-container');
        p.noCursor();

        // 色の設定
        drawCol = p.color(50, 0, 200, 40);
        bgCol = p.color(0, 8);
        textEdgeCol = p.color(255);
        textCol = p.color(180, 200);
        cursorCol = p.color(255, 0, 0, 255);

        // テキストのスタイル設定
        p.textSize(TITLE_TEXT_SIZE);
        p.textFont('arial');
        textFillCol = p.color(200, 0, 100, 40);
        p.textStyle(p.BOLDITALIC);
        titleWidth = p.textWidth(titleText);
    };

    p.draw = () => {
        p.background(bgCol);
        p.stroke(drawCol);
        p.strokeWeight(1);
        p.fill(drawCol);

        //波の描画
        drawWave(ITER_STEP, MOUSE_DIST_THRESHOLD);
        // テキストの描画
        p.strokeWeight(2);
        p.stroke(textEdgeCol);
        p.fill(textCol);
        p.text(titleText, 0, p.height - TITLE_TEXT_SIZE/4);

        // マウスカーソルの描画
        p.stroke(cursorCol);
        p.strokeWeight(2);
        p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.mouseReleased = () => {
        isWavy = !isWavy;
        toggleViewSettings(isWavy);
    }
};

new p5(sketch);