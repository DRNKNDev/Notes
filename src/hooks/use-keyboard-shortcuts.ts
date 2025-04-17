import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Command (Meta) key is pressed
      if (event.metaKey) {
        switch (event.key) {
          case '/':
            // Command + / for Prompt
            event.preventDefault();
            navigate({ to: '/prompt' });
            break;
          case 'j':
          case 'J':
            // Command + J for Journal
            event.preventDefault();
            navigate({ to: '/journal' });
            break;
          case 'l':
          case 'L':
            // Command + L for Notes
            event.preventDefault();
            navigate({ to: '/notes' });
            break;
          default:
            // Do nothing for other key combinations
            break;
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
}
