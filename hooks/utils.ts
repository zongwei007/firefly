import { useState, useEffect } from 'react';

export function useTime() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    
    const id = setInterval(() => {
      setTime(new Date());
    }, 100);
    
    return () => clearInterval(id);
  }, []);

  return time;
}