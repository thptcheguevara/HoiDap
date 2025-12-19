
import React, { useState, useEffect } from 'react';
import type { Question } from '../types';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore =
        typeof storedValue === 'function'
          ? (storedValue as Function)(storedValue)
          : storedValue;

      // Intercept and strip dataUrls before saving to localStorage to avoid quota errors
      if (key === 'questions' && Array.isArray(valueToStore)) {
          const sanitizedValue = JSON.parse(JSON.stringify(valueToStore)); // Deep copy to avoid mutating state
          
          sanitizedValue.forEach((question: Question) => {
            if (question.attachment) {
              delete question.attachment.dataUrl;
            }
            if (question.answers && Array.isArray(question.answers)) {
              question.answers.forEach(answer => {
                if (answer.attachment) {
                   delete answer.attachment.dataUrl;
                }
              });
            }
          });
        window.localStorage.setItem(key, JSON.stringify(sanitizedValue));
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

    } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.error(`LocalStorage quota exceeded for key "${key}". Could not save data. Please clear some old questions or attachments.`);
        // Optionally alert the user here.
      } else {
        console.error("Could not save to localStorage:", error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
