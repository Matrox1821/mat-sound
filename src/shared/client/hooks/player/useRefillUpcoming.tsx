import { useEffect } from "react";

export const useRefillUpcoming = ({
  refillUpcoming,
  currentTrack,
}: {
  refillUpcoming: () => void;
  currentTrack: boolean;
}) => {
  useEffect(() => {
    if (!currentTrack) return;
    refillUpcoming();
  }, [currentTrack, refillUpcoming]);
};
