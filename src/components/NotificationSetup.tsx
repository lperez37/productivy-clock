/**
 * A modal component for setting up NTFY push notifications.
 * Allows users to configure custom NTFY servers and notification messages.
 */

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ExternalLink, X, Bell } from 'lucide-react';

interface NotificationSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: NotificationConfig) => void;
  existingConfig?: NotificationConfig;
}

export interface NotificationConfig {
  server: string;
  isCustomServer: boolean;
  topic: string;
  message: string;
}

export const NotificationSetup: React.FC<NotificationSetupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingConfig,
}) => {
  const [config, setConfig] = useState<NotificationConfig>(() => ({
    server: 'https://ntfy.sh',
    isCustomServer: false,
    topic: '',
    message: '',
    ...existingConfig,
  }));

  const [error, setError] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const validateConfig = () => {
    setError('');

    // Validate server URL
    try {
      new URL(config.server);
    } catch {
      setError('Invalid server URL');
      return false;
    }

    // Validate topic
    if (!config.topic.match(/^[a-zA-Z0-9_-]+$/)) {
      setError('Topic can only contain letters, numbers, underscores, and hyphens');
      return false;
    }

    return true;
  };

  const handleTest = async () => {
    if (!validateConfig()) return;

    setIsTesting(true);
    try {
      const response = await fetch(`${config.server}/${config.topic}`, {
        method: 'POST',
        body: 'Test notification from your Productivy Clock',
        headers: {
          'Title': 'Test Notification',
          'Priority': 'default',
          'Tags': 'stopwatch'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      setError('Test notification sent successfully!');
    } catch (err) {
      setError('Failed to send test notification. Please check your configuration.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!validateConfig()) return;
    onSave(config);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white/90 dark:bg-[var(--mocha-surface0)] backdrop-blur-sm p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Dialog.Title className="text-lg font-medium">
                Push Notification Setup
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-black/60 dark:text-[var(--mocha-subtext1)]">
                This app uses NTFY for push notifications. You can install the NTFY app on your devices from{' '}
                <a
                  href="https://ntfy.sh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--latte-blue)] dark:text-[var(--mocha-blue)] hover:underline inline-flex items-center gap-1"
                >
                  ntfy.sh <ExternalLink size={14} />
                </a>
              </Dialog.Description>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-black/40 dark:text-[var(--mocha-subtext1)] hover:text-black/60 dark:hover:text-[var(--mocha-text)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Server</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!config.isCustomServer}
                    onChange={() => setConfig(prev => ({ ...prev, isCustomServer: false, server: 'https://ntfy.sh' }))}
                    className="text-[var(--latte-mauve)] dark:text-[var(--mocha-mauve)]"
                  />
                  <span>ntfy.sh (Default)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={config.isCustomServer}
                    onChange={() => setConfig(prev => ({ ...prev, isCustomServer: true }))}
                    className="text-[var(--latte-mauve)] dark:text-[var(--mocha-mauve)]"
                  />
                  <span>Custom Server</span>
                </label>
              </div>
            </div>

            {config.isCustomServer && (
              <div>
                <label className="block text-sm font-medium mb-2">Server URL</label>
                <input
                  type="url"
                  value={config.server}
                  onChange={(e) => setConfig(prev => ({ ...prev, server: e.target.value }))}
                  placeholder="https://your-ntfy-server.com"
                  className="w-full px-4 py-2 rounded-lg bg-black/5 dark:bg-[var(--mocha-base)] focus:outline-none focus:ring-2 focus:ring-[var(--latte-mauve)] dark:focus:ring-[var(--mocha-mauve)]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={config.topic}
                onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="your-unique-topic"
                className="w-full px-4 py-2 rounded-lg bg-black/5 dark:bg-[var(--mocha-base)] focus:outline-none focus:ring-2 focus:ring-[var(--latte-mauve)] dark:focus:ring-[var(--mocha-mauve)]"
              />
              <p className="mt-1 text-xs text-black/40 dark:text-[var(--mocha-subtext1)]">
                Only letters, numbers, underscores, and hyphens allowed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Custom Message (Optional)</label>
              <input
                type="text"
                value={config.message}
                onChange={(e) => setConfig(prev => ({ ...prev, message: e.target.value }))}
                placeholder="This is a notification from your Productivy Clock"
                className="w-full px-4 py-2 rounded-lg bg-black/5 dark:bg-[var(--mocha-base)] focus:outline-none focus:ring-2 focus:ring-[var(--latte-mauve)] dark:focus:ring-[var(--mocha-mauve)]"
              />
            </div>

            <button
              onClick={handleTest}
              disabled={isTesting}
              className="text-sm text-[var(--latte-blue)] dark:text-[var(--mocha-blue)] hover:underline inline-flex items-center gap-1 disabled:opacity-50"
            >
              <Bell size={14} className="mt-0.5" />
              {isTesting ? 'Sending test notification...' : 'Send a test push notification'}
            </button>

            {error && (
              <p className={`text-sm ${error.includes('successfully') ? 'text-[var(--latte-green)] dark:text-[var(--mocha-green)]' : 'text-[var(--latte-red)] dark:text-[var(--mocha-red)]'}`}>
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-[var(--mocha-base)] dark:hover:bg-[var(--mocha-mantle)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-[var(--latte-mauve)] hover:bg-[var(--latte-pink)] dark:bg-[var(--mocha-mauve)] dark:hover:bg-[var(--mocha-pink)] text-white dark:hover:text-[var(--mocha-crust)] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 