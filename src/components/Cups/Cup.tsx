import React from "react";
import { motion } from "framer-motion";

interface CupProps {
  cupId: number;
  isSelectedLift: boolean;
  showCupTransform: boolean;
  showBall: boolean;
  ballIndex: number;
  index: number;
  cupVariants: any;
  shadowVariants: any;
  onClick: () => void;
}

const Cup: React.FC<CupProps> = ({
  cupId,
  isSelectedLift,
  showCupTransform,
  showBall,
  ballIndex,
  index,
  cupVariants,
  shadowVariants,
  onClick,
}) => (
  <motion.div className="cup-box" key={cupId} layout>
    <motion.div
      initial={"normal"}
      animate={isSelectedLift ? "lift" : "normal"}
      variants={cupVariants}
      className={`cup ${!showCupTransform ? "no-transition" : ""}`}
      onClick={onClick}
    />
    {showBall && ballIndex === index && <div className="ball" />}
    <motion.div
      animate={isSelectedLift ? "lift" : "normal"}
      variants={shadowVariants}
      className="cup-shadow"
    />
  </motion.div>
);

export default Cup;
