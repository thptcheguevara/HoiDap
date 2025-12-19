
import React from 'react';

interface IconProps {
  className?: string;
}

export const RefreshIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-3.181-4.992a8.25 8.25 0 00-11.664 0l-3.18 3.185" />
    </svg>
);

export const PaperclipIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export const ChatBubbleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export const GeminiIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.49988 11.25C8.04988 11.25 8.49988 10.8 8.49988 10.25C8.49988 9.7 8.04988 9.25 7.49988 9.25C6.94988 9.25 6.49988 9.7 6.49988 10.25C6.49988 10.8 6.94988 11.25 7.49988 11.25Z" fill="currentColor"/>
        <path d="M13.4999 19.25C14.0499 19.25 14.4999 18.8 14.4999 18.25C14.4999 17.7 14.0499 17.25 13.4999 17.25C12.9499 17.25 12.4999 17.7 12.4999 18.25C12.4999 18.8 12.9499 19.25 13.4999 19.25Z" fill="currentColor"/>
        <path d="M10.75 2.75C10.75 2.2 10.3 1.75 9.75 1.75C9.2 1.75 8.75 2.2 8.75 2.75V6.01001C8.75 6.56001 9.2 7.01001 9.75 7.01001C10.3 7.01001 10.75 6.56001 10.75 6.01001V2.75Z" fill="currentColor"/>
        <path d="M12.91 10.9C14.65 10.15 16.65 10.59 18.06 12C19.47 13.41 19.9 15.41 19.16 17.15L12.91 10.9Z" fill="currentColor"/>
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
