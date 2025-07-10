export const STATUS = {
    ACTIVE: 'active',
    PENDING: 'pending',
    DELETED: 'deleted',
};

export const getProvinces = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/province`, {
        cache: 'no-store',
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch provinces:', error);
      return [];
    }
  };
  