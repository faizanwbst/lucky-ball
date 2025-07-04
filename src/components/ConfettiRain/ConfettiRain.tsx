import React from "react";
import Lottie from "react-lottie";
import confettiimage1 from "../../assets/confetti/spin-confetti-1.json";
import confettiimage2 from "../../assets/confetti/spin-confetti-2.json";
import "./ConfettiRain.css";

const confetti1 = {
  loop: true,
  autoplay: true,
  animationData: confettiimage1,
};

const confetti2 = {
  loop: true,
  autoplay: true,
  animationData: confettiimage2,
};

const ConfettiRain: React.FC = () => {
  const ribbons = [
    { className: "confetti1", first: confetti1, second: confetti2 },
    { className: "confetti2", first: confetti2, second: confetti1 },
    { className: "confetti3", first: confetti2, second: confetti1 },
    { className: "confetti4", first: confetti1, second: confetti2 },
  ];

  return (
    <>
      {ribbons.map((ribbon) => (
        <div className={ribbon.className} key={ribbon.className}>
          <Lottie options={ribbon.first} height={600} width="100%" />
          <Lottie options={ribbon.second} height={600} width="100%" />
        </div>
      ))}
    </>
  );
};

export default ConfettiRain;
