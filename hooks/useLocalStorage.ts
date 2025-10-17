/**
 * Custom React Hooks for LocalStorage
 * Provides reactive localStorage with automatic persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/localStorage';

/**
 * Hook for managing localStorage with React state
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.get(key, initialValue);
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

/**
 * Hook for listening to localStorage changes across tabs
 */
export function useStorageEvent(key: string, callback: (newValue: any) => void) {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue);
          callback(newValue);
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, callback]);
}

/**
 * Hook for managing array data in localStorage
 */
export function useLocalStorageArray<T>(key: string) {
  const [items, setItems] = useLocalStorage<T[]>(key, []);

  const addItem = useCallback((item: T) => {
    setItems(current => [...current, item]);
  }, [setItems]);

  const removeItem = useCallback((index: number) => {
    setItems(current => current.filter((_, i) => i !== index));
  }, [setItems]);

  const updateItem = useCallback((index: number, updatedItem: T) => {
    setItems(current => 
      current.map((item, i) => i === index ? updatedItem : item)
    );
  }, [setItems]);

  const clearItems = useCallback(() => {
    setItems([]);
  }, [setItems]);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    setItems,
  };
}

/**
 * Hook for managing object data in localStorage
 */
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T
) {
  const [data, setData] = useLocalStorage<T>(key, initialValue);

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(current => ({
      ...current,
      [field]: value,
    }));
  }, [setData]);

  const updateNestedField = useCallback((path: string, value: any) => {
    setData(current => {
      const newData = { ...current };
      const keys = path.split('.');
      let obj: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  }, [setData]);

  const reset = useCallback(() => {
    setData(initialValue);
  }, [setData, initialValue]);

  return {
    data,
    setData,
    updateField,
    updateNestedField,
    reset,
  };
}

/**
 * Hook for managing toggle state in localStorage
 */
export function useLocalStorageToggle(key: string, initialValue: boolean = false) {
  const [value, setValue] = useLocalStorage(key, initialValue);

  const toggle = useCallback(() => {
    setValue(current => !current);
  }, [setValue]);

  const setTrue = useCallback(() => {
    setValue(true);
  }, [setValue]);

  const setFalse = useCallback(() => {
    setValue(false);
  }, [setValue]);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
}

/**
 * Hook for debounced localStorage updates
 */
export function useDebouncedLocalStorage<T>(
  key: string,
  initialValue: T,
  delay: number = 500
) {
  const [value, setValue] = useState<T>(() => storage.get(key, initialValue));
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      storage.set(key, value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, key]);

  return [value, setValue, debouncedValue] as const;
}