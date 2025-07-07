import { useState, useCallback, useRef } from "react";
import { animationVariant, pickRandom, shuffle } from "../helpers/utils";
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
  const [cups, setCups] = useState<number[]>(shuffle([1, 2, 3]));
  const [random, setRandom] = useState(pickRandom([1, 2, 3]));
  const [selectedCupId, setSelectedCupId] = useState<number | null>(random);
  const [showInitialStart, setShowInitialStart] = useState<boolean>(true);
  const [showWinOverlay, setShowWinOverlay] = useState<boolean>(false);
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
        setResultState({ isShow: true, win: idx === random });
        if (idx === random) {
          winAudioRef.current.currentTime = 0;
          winAudioRef.current.play();
          applaudAudioRef.current.currentTime = 0;
          applaudAudioRef.current.play();
          setShowWinOverlay(true);
        } else {
          loseAudioRef.current.currentTime = 0;
          loseAudioRef.current.play();
        }
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
    setSelectedCupId(random);
    setTimeout(() => {
      setSelectedCupId(null);
      setTimeout(() => {
        const randomIndex = pickRandom([1, 2, 3]);
        setRandom(randomIndex);
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

  const ballIndex = cups.indexOf(random);

  const handleCloseWinOverlay = () => {
    setShowWinOverlay(false);
    stopSounds();
  };

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
              showBall={(resultState.isShow && cup === random) || shuffling}
              ballIndex={ballIndex}
              index={index}
              cupVariants={animationVariant.cupVariants}
              shadowVariants={animationVariant.shadowVariants}
              onClick={
                showInitialStart
                  ? handleInitialStart
                  : handleCupClick(cup) || (() => {})
              }
            />
          ))}
        </div>
      </div>
      <ResultArea
        showInitialStart={showInitialStart}
        resultState={resultState}
        shuffling={shuffling}
        onPlayAgain={resetGame}
        showWinOverlay={showWinOverlay}
        onCloseWinOverlay={handleCloseWinOverlay}
      />
    </div>
  );
};

export default Cups;
