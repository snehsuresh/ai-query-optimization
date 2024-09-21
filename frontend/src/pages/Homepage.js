import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const HomePage = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const preOptimizationRef = useRef();
    const postOptimizationRef = useRef();

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleOptimize = async () => {
        try {
            const result = await axios.post(`${apiBaseUrl}/optimize`, { sql: query });
            console.log(result);
            setResponse(result.data);
        } catch (error) {
            console.error('Error optimizing:', error);
            setResponse(null);
        }
    };

    const drawChart = (data, ref, title, lineColor) => {
        d3.select(ref.current).selectAll("*").remove(); // Clear previous chart

        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([1, data.length]) // X-axis: Index of execution times
            .range([0, width]);

        const minExecTime = 0.1; // Minimum value for the Y-axis
        const maxExecTime = d3.max(data); // Dynamic maximum value for Y-axis
        const y = d3.scaleLinear()
            .domain([minExecTime, maxExecTime * 1.1]) // Increase the upper limit by 10%
            .range([height, 0]);

        const line = d3.line()
            .x((d, i) => x(i + 1))
            .y(d => y(d));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", lineColor)
            .attr("stroke-width", 1.5)
            .attr("d", line);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(data.length));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .text(title);
    };

    useEffect(() => {
        if (response) {
            // Draw both charts independently
            drawChart(response.originalProfile.execTimes, preOptimizationRef, "", "red");
            drawChart(response.optimizedProfile.execTimes, postOptimizationRef, "", "green");
        }
    }, [response]);

    return (
        <div className="bg-white min-h-screen p-8">
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
                    <div className="flex-1 bg-green-200 rounded-lg p-4 m-2 h-64 flex items-center justify-center">
                        {response && response.optimizedProfile && (
                            <textarea
                                value={response.optimizedQuery.parts[0].text}
                                readOnly
                                className="w-full h-full p-2 bg-gray-100 border border-gray-300 rounded-lg resize-none"
                            />
                        )}
                    </div>
                </div>
                <button
                    onClick={handleOptimize}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-8"
                >
                    Optimize
                </button>
            </section>

            <section className="flex flex-col items-center mb-16">
                <h2 className="text-xl font-semibold mb-8 text-center">Metrics</h2>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 text-center">Pre-Optimization Execution</h3>
                        <div ref={preOptimizationRef} className="h-40 w-full"></div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 text-center">Post-Optimization Execution</h3>
                        <div ref={postOptimizationRef} className="h-40 w-full"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
