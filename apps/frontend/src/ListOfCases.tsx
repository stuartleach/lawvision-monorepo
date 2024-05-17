import React, { useState, useEffect } from 'react';
import { getCases, runServerUtils } from './api';
import type { supreme_court_cases as SupremeCourtCase } from '@shared/prisma';

const App = () => {
    const [cases, setCases] = useState<SupremeCourtCase[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ensure cases is always an array
        if (!Array.isArray(cases)) {
            setCases([]);
        }
    }, [cases]);

    const fetchCases = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getCases(10); // Fetch 10 cases
            if (Array.isArray(result)) {
                setCases(result);
            } else {
                setError('API did not return an array');
            }
        } catch (err) {
            setError('Failed to fetch cases');
        } finally {
            setLoading(false);
        }
    };

    const handleRunServerUtils = async () => {
        try {
            setLoading(true);
            setError(null);
            await runServerUtils();
            alert('Server utils job completed successfully');
        } catch (err) {
            setError('Failed to run server utils job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Supreme Court Cases</h1>
            <button onClick={fetchCases} disabled={loading}>
                Fetch Cases
            </button>
            <button onClick={handleRunServerUtils} disabled={loading}>
                Run Server Utils Job
            </button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {cases.map((c) => (
                    <li key={c.id}>{c.name} ({c.term})</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
