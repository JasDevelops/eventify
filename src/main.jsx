import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import * as atatus from 'atatus-spa';
atatus.config('a9ff8126dfbd47bfb0e8dfc29b814ce4').install();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>
);
