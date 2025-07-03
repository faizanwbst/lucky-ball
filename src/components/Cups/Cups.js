import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { shuffle } from "../helpers/utils";
import ConfettiRain from "../ConfettiRain/ConfettiRain";
import "./Cups.css";

const cupVariants = {
  lift: { y: -80, x: -40, rotate: "-25deg" },
  normal: { y: 0, x: 0, rotate: "0deg" },
};

const shadowVariants = {
  lift: { x: -20, scale: 0.75 },
  normal: { x: 0, scale: 1 },
};

const Cups = () => {
  const [showCupTransform, setShowCupTransform] = useState(true);
  const [shuffling, setShuffling] = useState(true);
  const [resultState, setResultState] = useState({
    isShow: false,
    win: false,
  });
  const [selectedCupId, setSelectedCupId] = useState(1);
  const [cups, setCups] = useState(shuffle([1, 2, 3]));

  const handleCupClick = (idx) => {
    if (resultState.isShow) return;
    return () => {
      if (!shuffling) {
        setShowCupTransform(true);
        const cupSelected = idx === selectedCupId ? null : idx;
        setSelectedCupId(cupSelected);
        // setTimeout(() => {
        setResultState({ isShow: true, win: idx === 1 });
        // }, 1000);
      }
    };
  };

  const startShuffle = () => {
    setShowCupTransform(false);
    let count = 0;
    const shuffleOnce = () => {
      const shuffled = shuffle(cups);
      setCups(shuffled);
      setTimeout(() => {
        if (count < 20) {
          count++;
          shuffleOnce();
        } else {
          setShuffling(false);
        }
      }, 200);
    };
    shuffleOnce();
  };

  const resetGame = () => {
    setShowCupTransform(true);
    setShuffling(true);
    setResultState({ win: false, isShow: false });
    setSelectedCupId(1);
    setTimeout(() => {
      setSelectedCupId(null);
      setTimeout(() => {
        startShuffle();
      }, 200);
    }, 2000);
  };

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">PICK YOUR LUCKY BALL</h1>
      <div className="play-area">
        <div className="cup-area">
          {cups.map((cup, index) => {
            const isSelectedLift = cup === selectedCupId;
            const showBall = (resultState.isShow && cup === 1) || shuffling;
            const ballIndex = cups.indexOf(1);
            return (
              <motion.div className="cup-box" key={cup} layout>
                <motion.div
                  initial={"normal"}
                  animate={isSelectedLift ? "lift" : "normal"}
                  variants={cupVariants}
                  className={`cup ${!showCupTransform ? "no-transition" : ""}`}
                  onClick={handleCupClick(cup)}
                />
                {showBall && ballIndex === index && <div className="ball" />}
                <motion.div
                  animate={isSelectedLift ? "lift" : "normal"}
                  variants={shadowVariants}
                  className="cup-shadow"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
      {resultState.isShow ? (
        resultState.win ? (
          <p className="won-text"> You Won</p>
        ) : (
          <p className="lose-text"> You Lose</p>
        )
      ) : shuffling ? (
        <div className="instructions">Remember the ball position</div>
      ) : (
        <div className="instructions">Choose cup with the ball</div>
      )}

      {resultState.win && resultState.isShow && (
        <div className="confetti-container">
          <ConfettiRain />
        </div>
      )}
      {resultState.isShow && (
        <button
          className={resultState.win ? "won" : "loss"}
          onClick={resetGame}
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default Cups;
