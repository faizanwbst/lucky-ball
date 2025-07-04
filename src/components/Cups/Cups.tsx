import { useState, useCallback, useRef } from "react";
import { animationVariant, shuffle } from "../helpers/utils";
import Cup from "./Cup";
import ResultArea from "./ResultArea";
import shuffleSound from "../../assets/audio/card-shuffling.mp3";
import applaudSound from "../../assets/audio/applaud.mp3";
import winSound from "../../assets/audio/win.mp3";
import loseSound from "../../assets/audio/lose.mp3";
import "./Cups.css";

interface ResultState {
  isShow: boolean;
  win: boolean;
}

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
  const shuffleAudioRef = useRef<HTMLAudioElement>(new Audio(shuffleSound));
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
          winAudioRef.current.currentTime = 0;
          winAudioRef.current.play();
          applaudAudioRef.current.currentTime = 0;
          applaudAudioRef.current.play();
        } else {
          loseAudioRef.current.currentTime = 0;
          loseAudioRef.current.play();
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

  const ballIndex = cups.indexOf(1);

  return (
    <div className="app-container">
      <h1 className="title">PICK YOUR LUCKY BALL</h1>
      <div className="play-area">
        <div className="cup-area">
          {cups.map((cup, index) => (
            <Cup
              key={cup}
              cupId={cup}
              isSelectedLift={cup === selectedCupId}
              showCupTransform={showCupTransform}
              showBall={(resultState.isShow && cup === 1) || shuffling}
              ballIndex={ballIndex}
              index={index}
              cupVariants={animationVariant.cupVariants}
              shadowVariants={animationVariant.shadowVariants}
              onClick={showInitialStart ? handleInitialStart : handleCupClick(cup) || (() => {})}
            />
          ))}
        </div>
      </div>
      <ResultArea
        showInitialStart={showInitialStart}
        resultState={resultState}
        shuffling={shuffling}
        onPlayAgain={resetGame}
      />
    </div>
  );
};

export default Cups;
