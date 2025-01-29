import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App.jsx';
import * as atatus from 'atatus-spa';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

atatus.config('a9ff8126dfbd47bfb0e8dfc29b814ce4').install();

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
serviceWorkerRegistration.register();
