import React, { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log("_++++sneh", apiBaseUrl)
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');

    // Handle the change in the textarea
    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleOptimize = async () => {
        try {
            console.log("Sending request to backend.."); // Debugging log
            const result = await axios.post(`${apiBaseUrl}/optimize`, { query });
            console.log("Response from backend:", result.data); // Debugging log
            setResponse(result.data.message); // Adjust based on your backend response structure
        } catch (error) {
            console.error('Error optimizing:', error);
            setResponse('An error occurred.');
        }
    };

    return (
        <div className="bg-white min-h-screen p-8">
            {/* First Section */}
            <section className="flex flex-col items-center mb-16">
                <div className="flex w-full max-w-screen-lg">
                    <div className="flex-1 bg-gray-200 rounded-lg p-4 m-2 h-64 flex items-center justify-center">
                        <textarea
                            value={query}
                            onChange={handleChange}
                            placeholder="Your test query goes here..."
                            className="w-full h-full p-2 bg-gray-100 border border-gray-300 rounded-lg resize-none"
                        />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-lg p-4 m-2 h-64 flex items-center justify-center">
                        <p>{response || 'Box 2'}</p>
                    </div>
                </div>
                <button
                    onClick={handleOptimize}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-8"
                >
                    Optimize
                </button>
            </section>

            {/* Second Section */}
            <section>
                <h2 className="text-xl font-semibold mb-8 text-center">Metrics</h2>
                <div className="grid grid-cols-2 gap-8">
                    {/* Pre-Optimization Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Pre-Optimization</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
                                <p>Image Placeholder 1</p>
                            </div>
                            <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
                                <p>Image Placeholder 2</p>
                            </div>
                            <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
                                <p>Image Placeholder 3</p>
                            </div>
                        </div>
                    </div>

                    {/* Post-Optimization Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Post-Optimization</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
                                <p>Image Placeholder 1</p>
                            </div>
                            <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
                                <p>Image Placeholder 2</p>
                            </div>
                            <div className="bg-gray-200 rounded-lg w-full h-40 flex items-center justify-center">
                                <p>Image Placeholder 3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
