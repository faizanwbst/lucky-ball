import React from "react";
import ConfettiRain from "../ConfettiRain/ConfettiRain";

interface ResultAreaProps {
  showInitialStart: boolean;
  resultState: { isShow: boolean; win: boolean };
  shuffling: boolean;
  onPlayAgain: () => void;
}

const ResultArea: React.FC<ResultAreaProps> = ({
  showInitialStart,
  resultState,
  shuffling,
  onPlayAgain,
}) => (
  <div className="result-area">
    {showInitialStart ? (
      <div className="instructions">Click on any 'Cup' to start playing.</div>
    ) : resultState.isShow ? (
      resultState.win ? (
        <p className="won-text">You Won</p>
      ) : (
        <p className="lose-text">You Lose</p>
      )
    ) : shuffling ? (
      <div className="instructions">Remember the 'Ball' position</div>
    ) : (
      <div className="instructions">Choose 'Cup' with the 'Ball'</div>
    )}

    {resultState.win && resultState.isShow && (
      <div className="confetti-container">
        <ConfettiRain />
      </div>
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

export default ResultArea;
