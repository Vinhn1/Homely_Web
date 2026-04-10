/**
 * useDebounce — trì hoãn cập nhật value sau delay ms
 * Dùng để giảm số lần gọi API khi user đang gõ
 *
 * @example
 * const debouncedSearch = useDebounce(searchInput, 400);
 * useEffect(() => { fetchData(debouncedSearch); }, [debouncedSearch]);
 */
import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: xóa timer cũ mỗi khi value thay đổi
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
