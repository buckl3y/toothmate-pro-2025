import React, { useState } from 'react';
import MixedView from './MixedView'; // Import the DentalChart component

const Chart = () => {
    // State to track the selected view
    const [selectedView, setSelectedView] = useState('');

    // Handler to update the selected view
    const handleViewChange = (event) => {
        setSelectedView(event.target.value);
    };

    return (
        <div className="chart-container bg-white rounded-2xl drop-shadow-md h-4/5 relative">
            {selectedView === 'mixed' && <MixedView />}
            <div className="radioButtons absolute flex flex-row gap-4 bottom-0 left-0 p-4">
                <div>
                    <input type="radio" id="childView" name="view" value="child" onChange={handleViewChange} />
                    <label htmlFor="childView">Child view</label>
                </div>
                <div>
                    <input type="radio" id="adultView" name="view" value="adult" onChange={handleViewChange} />
                    <label htmlFor="adultView">Adult view</label>
                </div>
                <div>
                    <input type="radio" id="mixedView" name="view" value="mixed" onChange={handleViewChange} />
                    <label htmlFor="mixedView">Mixed view</label>
                </div>
            </div>
        </div>
    );
};

export default Chart;
