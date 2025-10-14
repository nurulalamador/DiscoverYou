import React, { useEffect, useState } from "react";
import { Text } from "react-native";

const CountdownTimer = ({ initialSeconds, style } : any) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev : any) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (totalSeconds : any) => {
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days ? days+"d " : ""}${hours ? hours+"h " : ""}${minutes ? minutes+"h " : ""}${seconds ? seconds+"h " : ""}`;
  };

  return <Text style={style}>{formatTime(secondsLeft)}</Text>;
};

export default CountdownTimer;
