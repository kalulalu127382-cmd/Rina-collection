'use client';

import { useState, useEffect } from 'react';

export function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set end time to midnight tonight
    function getEndTime() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return end.getTime();
    }

    function update() {
      const diff = getEndTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 24, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1">
      <TimerBox value={pad(timeLeft.hours)} />
      <span className="text-primary font-bold text-xs">:</span>
      <TimerBox value={pad(timeLeft.minutes)} />
      <span className="text-primary font-bold text-xs">:</span>
      <TimerBox value={pad(timeLeft.seconds)} />
    </div>
  );
}

function TimerBox({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-6 bg-[#F85606] text-white text-xs font-bold font-sans rounded">
      {value}
    </span>
  );
}
