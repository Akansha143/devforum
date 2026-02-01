import { useState, useEffect } from 'react';

export function useFirestore(subscribeFunction, dependencies = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeFunction((newData) => {
      setData(newData);
      setLoading(false);
      setError(null);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, dependencies);

  return { data, loading, error };
}