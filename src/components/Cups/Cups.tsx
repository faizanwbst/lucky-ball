import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { shuffle } from "../helpers/utils";
import ConfettiRain from "../ConfettiRain/ConfettiRain";
import shuffleSound from "../../assets/audio/card-shuffling.mp3";
import applaudSound from "../../assets/audio/applaud.mp3";
import winSound from "../../assets/audio/win.mp3";
import loseSound from "../../assets/audio/lose.mp3";
import "./Cups.css";

interface ResultState {
  isShow: boolean;
  win: boolean;
}

const cupVariants = {
  lift: { y: -80, x: -40, rotate: "-25deg" },
  normal: { y: 0, x: 0, rotate: "0deg" },
};

const shadowVariants = {
  lift: { x: -20, scale: 0.75 },
  normal: { x: 0, scale: 1 },
};

const Cups: React.FC = () => {
  const [showCupTransform, setShowCupTransform] = useState<boolean>(true);
  const [shuffling, setShuffling] = useState<boolean>(true);
  const [resultState, setResultState] = useState<ResultState>({
    isShow: false,
    win: false,
  });
  const [selectedCupId, setSelectedCupId] = useState<number | null>(1);
  const [cups, setCups] = useState<number[]>(shuffle([1, 2, 3]));
  const [showInitialStart, setShowInitialStart] = useState<boolean>(true);
  const shuffleAudioRef = useRef<HTMLAudioElement | null>(
    new Audio(shuffleSound)
  );
  const applaudAudioRef = useRef<HTMLAudioElement>(new Audio(applaudSound));
  const winAudioRef = useRef<HTMLAudioElement>(new Audio(winSound));
  const loseAudioRef = useRef<HTMLAudioElement>(new Audio(loseSound));

  const handleCupClick = (idx: number) => {
    if (resultState.isShow) return;
    return () => {
      if (!shuffling) {
        setShowCupTransform(true);
        const cupSelected = idx === selectedCupId ? null : idx;
        setSelectedCupId(cupSelected);
        // setTimeout(() => {
        setResultState({ isShow: true, win: idx === 1 });
        if (idx === 1) {
          // winAudioRef.current.currentTime = 0;
          // winAudioRef.current.play();
          // applaudAudioRef.current.currentTime = 0;
          // applaudAudioRef.current.play();
        } else {
          // loseAudioRef.current.currentTime = 0;
          // loseAudioRef.current.play();
        }
        // }, 1000);
      }
    };
  };

  const startShuffle = () => {
    setShowCupTransform(false);
    playShuffleSound();
    let count = 0;
    const shuffleOnce = () => {
      setCups(shuffle(cups));
      setTimeout(() => {
        if (count < 20) {
          count++;
          shuffleOnce();
        } else {
          setShuffling(false);
          stopShuffleSound();
        }
      }, 200);
    };
    shuffleOnce();
  };

  const resetGame = () => {
    setShowCupTransform(true);
    setShuffling(true);
    setResultState({ win: false, isShow: false });
    stopSounds();
    setSelectedCupId(1);
    setTimeout(() => {
      setSelectedCupId(null);
      setTimeout(() => {
        startShuffle();
      }, 2000);
    }, 500);
  };

  const handleInitialStart = () => {
    setShowInitialStart(false);
    resetGame();
  };

  const playShuffleSound = useCallback(() => {
    if (!shuffleAudioRef.current) {
      shuffleAudioRef.current = new Audio(shuffleSound);
    }
    if (shuffleAudioRef.current) {
      shuffleAudioRef.current.currentTime = 0;
      shuffleAudioRef.current.play().catch((error: unknown) => {
        console.error("Audio playback failed:", error);
      });
    }
  }, []);

  const stopShuffleSound = () => {
    if (shuffleAudioRef.current) {
      shuffleAudioRef.current.pause();
      shuffleAudioRef.current.currentTime = 0;
    }
  };

  const stopSounds = () => {
    if (applaudAudioRef.current) {
      applaudAudioRef.current.pause();
      applaudAudioRef.current.currentTime = 0;
    }
    if (winAudioRef.current) {
      winAudioRef.current.pause();
      winAudioRef.current.currentTime = 0;
    }
    if (loseAudioRef.current) {
      loseAudioRef.current.pause();
      loseAudioRef.current.currentTime = 0;
    }
  };

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
                {ballIndex}
                <motion.div
                  initial={"normal"}
                  animate={isSelectedLift ? "lift" : "normal"}
                  variants={cupVariants}
                  className={`cup ${!showCupTransform ? "no-transition" : ""}`}
                  onClick={
                    showInitialStart ? handleInitialStart : handleCupClick(cup)
                  }
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

      <div className="result-area">
        {showInitialStart ? (
          <div className="instructions">
            Click on any 'Cup' to start playing.
          </div>
        ) : resultState.isShow ? (
          resultState.win ? (
            <p className="won-text">You Won</p>
          ) : (
            <p className="lose-text">You Lose</p>
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
        <div className="button-area">
          {resultState.isShow && (
            <button
              className={resultState.win ? "won" : "loss"}
              onClick={resetGame}
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cups;
