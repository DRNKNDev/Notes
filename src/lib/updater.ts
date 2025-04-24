import { useState, useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'ready' | 'error';

export interface UpdateState {
  status: UpdateStatus;
  error?: string;
  progress?: number;
  version?: string;
}

export function useAppUpdater() {
  const [updateState, setUpdateState] = useState<UpdateState>({
    status: 'idle',
  });

  const checkForUpdates = async () => {
    try {
      // Set status to checking
      setUpdateState({ status: 'checking' });
      
      // Check for updates using Tauri updater
      const update = await check();
      
      // Log update availability (minimal logging)
      if (update) {
        console.log(`Update available: ${update.version}`);
        
        // Start downloading the update
        setUpdateState({ 
          status: 'downloading', 
          version: update.version,
          progress: 0 
        });
        
        let downloaded = 0;
        let contentLength = 0;
        
        // Download and install the update
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              contentLength = event.data.contentLength || 0;
              break;
            case 'Progress':
              downloaded += event.data.chunkLength;
              const progress = contentLength > 0 ? Math.round((downloaded / contentLength) * 100) : 0;
              setUpdateState(prev => ({
                ...prev,
                progress
              }));
              break;
            case 'Finished':
              // When download is complete, set status to ready
              setUpdateState({ 
                status: 'ready',
                version: update.version
              });
              break;
          }
        });
      } else {
        // No update available
        setUpdateState({ status: 'idle' });
      }
    } catch (error) {
      console.error('Update check failed:', error instanceof Error ? error.message : String(error));
      setUpdateState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  };

  const applyUpdate = async () => {
    if (updateState.status === 'ready') {
      try {
        // Relaunch the app to apply the update
        await relaunch();
      } catch (error) {
        console.error('Failed to apply update');
        setUpdateState({ 
          status: 'error', 
          error: 'Failed to relaunch the application' 
        });
      }
    }
  };

  // Automatically check for updates when the component mounts
  useEffect(() => {
    // Only check for updates in production
    if (import.meta.env.PROD) {
      checkForUpdates();
    }
  }, []);

  return {
    updateState,
    checkForUpdates,
    applyUpdate
  };
}
