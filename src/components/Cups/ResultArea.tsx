import React from "react";
import ConfettiRain from "../ConfettiRain/ConfettiRain";
import { winningList } from "../helpers/constants";

interface ResultAreaProps {
  showInitialStart: boolean;
  resultState: { isShow: boolean; win: boolean };
  shuffling: boolean;
  onPlayAgain: () => void;
  showWinOverlay?: boolean;
  onCloseWinOverlay?: () => void;
}

const ResultArea: React.FC<ResultAreaProps> = ({
  showInitialStart,
  resultState,
  shuffling,
  onPlayAgain,
  showWinOverlay,
  onCloseWinOverlay,
}) => {

  const randomIndex = Math.floor(Math.random() * winningList.length);
  const randomWinText = winningList[randomIndex]

  return (
    <div className="result-area">
      {showInitialStart ? (
        <div className="instructions">Click on any 'Cup' to start playing.</div>
      ) : resultState.isShow ? (
        resultState.win && showWinOverlay ? (
          <>
            <div className="win-text-container">
              <div className="win-text-overlay" onClick={onCloseWinOverlay} />
              <p className="won-text">{randomWinText}</p>
            </div>
            {resultState.win && resultState.isShow && showWinOverlay && (
              <div className="confetti-container">
                <ConfettiRain />
              </div>
            )}
          </>
        ) : !resultState.win ? (
          <p className="lose-text">You Lose</p>
        ) : null
      ) : shuffling ? (
        <div className="instructions">Remember the 'Ball' position</div>
      ) : (
        <div className="instructions">Choose 'Cup' with the 'Ball'</div>
      )}
  
      <div className="button-area">
        {resultState.isShow && (
          <button
            className={resultState.win ? "won" : "loss"}
            onClick={onPlayAgain}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ResultArea;
