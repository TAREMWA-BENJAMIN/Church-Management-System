import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher globally available for Echo
(window as any).Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: 'quahqo94ydriyz271qgi',
  wsHost: 'localhost',
  wsPort: 8080,
  wssPort: 8080,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
});

export default echo;
