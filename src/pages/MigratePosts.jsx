import React, { useState } from 'react';
import { Container, Button } from '../components';
import migratePostAuthors from '../utils/migratePostAuthors';

export default function MigratePosts() {
    const [status, setStatus] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleMigration = async () => {
        setIsRunning(true);
        setStatus('Starting migration...');
        
        try {
            // Capture console.log output
            const logs = [];
            const originalLog = console.log;
            console.log = (...args) => {
                const message = args.join(' ');
                logs.push(message);
                setStatus(prev => prev + '\n' + message);
                originalLog(...args);
            };

            await migratePostAuthors();
            
            // Restore console.log
            console.log = originalLog;
            
            setStatus(prev => prev + '\n\n Migration completed successfully!');
        } catch (error) {
            setStatus(prev => prev + '\n\n Migration failed: ' + error.message);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="py-8">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Migrate Post Authors</h1>
                    
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                            <li>Make sure you've added the <code className="bg-gray-700 px-2 py-1 rounded">authorName</code> attribute to your Appwrite collection</li>
                            <li>You must be logged in to run this migration</li>
                            <li>This will update all YOUR posts with your username</li>
                            <li>Posts by other users will be skipped</li>
                            <li>Posts that already have an author name will be skipped</li>
                        </ol>
                    </div>

                    <Button 
                        onClick={handleMigration}
                        disabled={isRunning}
                        className="w-full mb-4"
                        bgColor="bg-blue-500"
                    >
                        {isRunning ? 'Running Migration...' : 'Run Migration'}
                    </Button>

                    {status && (
                        <div className="bg-gray-900 rounded-lg p-4 mt-4">
                            <h3 className="text-lg font-semibold mb-2">Migration Log:</h3>
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                                {status}
                            </pre>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
