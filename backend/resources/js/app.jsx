import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#1e1e2e', color: '#f38ba8', minHeight: '100vh' }}>
                    <h2 style={{ color: '#cba6f7' }}>⚠️ Application Error</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#313244', padding: '1rem', borderRadius: '8px', color: '#cdd6f4' }}>
                        {this.state.error?.toString()}
                        {'\n\n'}
                        {this.state.error?.stack}
                    </pre>
                    <p style={{ color: '#a6e3a1' }}>Please screenshot this and share it to help diagnose the issue.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx', { eager: false }),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#696cff',
        showSpinner: true,
    },
});
