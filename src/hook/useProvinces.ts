'use client';

import { getProvinces } from '@/util/constant';
import { useEffect, useState } from 'react';


export function useProvinces() {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getProvinces();
      setProvinces(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { provinces, loading };
}
