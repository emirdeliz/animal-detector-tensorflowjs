import React, { useCallback, useEffect, useRef } from "react";

const highlighters = [] as Array<HTMLDivElement>;
const MIN_DETECTION_CONFIDENCE = 0.3;
// const RATIO_X = 1.1;
// const RATIO_Y = 1.2;

const AppBase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const initialize = useCallback(async () => {
    const video = videoRef.current as HTMLVideoElement;
    video.addEventListener("play", async () => {
      const loop = async () => {
        if (!video.paused && !video.ended) {
          // ctx.drawImage(video, 0, 0);
          detectImage(video);
          setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
      };
      loop();
    });
  }, []);

  const removeHighlighters = () => {
    do {
      const item = highlighters.pop();
      item?.remove();
    } while (highlighters.length);
  };

  const detectImage = async (video: HTMLVideoElement) => {
    const model = await globalThis.cocoSsd.load();
    const predictions = video ? await model.detect(video) : [];
    removeHighlighters();

    for (let n = 0; n < predictions.length; n += 1) {
      if (predictions[n].score > MIN_DETECTION_CONFIDENCE) {
        renderFoundObject(predictions[n]);
      }
    }
  };

  const renderFoundObject = useCallback((prediction) => {
    const highlighter = document.createElement("div");
    highlighter.style.position = "absolute";
    highlighter.style.border = "solid 2px red";
    highlighter.style.left = `${prediction.bbox[0]}px`;
    highlighter.style.top = `${prediction.bbox[1]}px`;
    highlighter.style.width = `${prediction.bbox[2]}px`;
    highlighter.style.height = `${prediction.bbox[3]}px`;

    videoRef.current?.parentNode?.appendChild(highlighter);
    highlighters.push(highlighter);
  }, []);

  useEffect(() => {
    setTimeout(initialize, 1000);
  }, [initialize]);

  return (
    <div>
      <h1>Find image</h1>
      <div>
        <video
          ref={videoRef}
          crossOrigin="anonymous"
          src="/cow.mov"
          controls
          width="100%"
        ></video>
      </div>
    </div>
  );
};

export const App = <AppBase />;
