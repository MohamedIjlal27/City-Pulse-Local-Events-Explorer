'use client';

/**
 * Example component demonstrating usage of the lib folder structure
 * This file is for reference only and can be deleted
 */

import { useLocalStorage, useUserPreferences } from '@/lib/hooks';
import { LocalEvent, STORAGE_KEYS } from '@/lib/types';
import { saveEvent, getSavedEvents, searchEvents } from '@/lib/services';

export function ExampleUsage() {
  // Example: Using useLocalStorage hook
  const [savedData, setSavedData] = useLocalStorage<string>('example_key', 'default');

  // Example: Using useUserPreferences hook
  const {
    preferences,
    addFavoriteCategory,
    removeFavoriteCategory,
    toggleNotifications,
  } = useUserPreferences();

  // Example: Using services
  const handleSaveEvent = (event: LocalEvent) => {
    saveEvent(event);
    const allSaved = getSavedEvents();
    console.log('Saved events:', allSaved);
  };

  // Example: Search events
  const events: LocalEvent[] = [];
  const searchResults = searchEvents(events, 'music');

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Example Usage</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">LocalStorage Hook</h3>
          <input
            type="text"
            value={savedData}
            onChange={(e) => setSavedData(e.target.value)}
            className="border p-2"
          />
        </div>

        <div>
          <h3 className="font-semibold">User Preferences</h3>
          <button
            onClick={() => addFavoriteCategory('Music')}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Add Music Category
          </button>
          <button
            onClick={toggleNotifications}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Toggle Notifications
          </button>
          <p>Notifications: {preferences.notificationsEnabled ? 'On' : 'Off'}</p>
        </div>
      </div>
    </div>
  );
}

