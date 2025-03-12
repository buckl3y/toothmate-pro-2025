// XrayHistory.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  uploadXray,
  deleteXray,
  checkXrayFilename,
} from '../../api';

const XrayHistory = ({ patient, refreshPatientData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single', 'comparison', 'quad'
  const [selectedXray, setSelectedXray] = useState(null);
  const [selectedXrays, setSelectedXrays] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatusMessage, setUploadStatusMessage] = useState('');
  const [uploadStatusColor, setUploadStatusColor] = useState('');
  const [deleteStatusMessage, setDeleteStatusMessage] = useState('');
  const [deleteStatusColor, setDeleteStatusColor] = useState('');

  const patientId = patient?.nhiNumber || '';

  // Local state for xrayHistory
  const [xrayHistory, setXrayHistory] = useState(patient?.xrayHistory || {});

  // Synchronize local xrayHistory with patient.xrayHistory
  useEffect(() => {
    setXrayHistory(patient?.xrayHistory || {});
  }, [patient]);

  // Zoom level state
  const [zoomLevel, setZoomLevel] = useState(1);

  // Annotation states
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentAnnotation, setCurrentAnnotation] = useState(null);

  // Handle wheel event for zooming
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    setZoomLevel((prevZoom) => {
      let newZoom = prevZoom - delta * 0.001;
      newZoom = Math.min(Math.max(newZoom, 0.5), 5);
      return newZoom;
    });
  };

  // Handle mouse events for annotations
  const handleMouseDown = (e) => {
    if (viewMode === 'single' && selectedXray) {
      setIsDrawing(true);
      const rect = e.target.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoomLevel;
      const y = (e.clientY - rect.top) / zoomLevel;
      setStartPoint({ x, y });
      setCurrentAnnotation({ x, y, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && currentAnnotation) {
      const rect = e.target.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoomLevel;
      const y = (e.clientY - rect.top) / zoomLevel;
  
      const x1 = startPoint.x;
      const y1 = startPoint.y;
      const x2 = x;
      const y2 = y;
  
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
  
      setCurrentAnnotation({
        x: left,
        y: top,
        width,
        height,
      });
    }
  };
  

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (currentAnnotation) {
        setAnnotations([...annotations, currentAnnotation]);
        setCurrentAnnotation(null);
      }
    }
  };

  // Handle Upload X-ray Modal Open
  const handleUploadXrayClick = (e) => {
    e.stopPropagation();
    setIsUploadModalOpen(true);
    setFileName('');
    setFile(null);
    setUploadStatusMessage('');
    setUploadStatusColor('');
  };

  // Handle Upload X-ray Modal Close
  const handleUploadModalClose = (e) => {
    e.stopPropagation();
    setIsUploadModalOpen(false);
    setUploadStatusMessage('');
    setUploadStatusColor('');
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle X-ray Upload
  const handleUploadXray = async () => {
    if (!file || !fileName) {
      setUploadStatusMessage('Please select a file and enter a file name.');
      setUploadStatusColor('text-red-500');
      return;
    }

    try {
      // Check if the file name already exists
      const checkResponse = await checkXrayFilename(patientId, fileName);

      if (checkResponse.data.exists) {
        setUploadStatusMessage('File name already exists. Please choose a different name.');
        setUploadStatusColor('text-red-500');
        return;
      }

      // Proceed to upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('patientId', patientId);

      const uploadResponse = await uploadXray(formData);

      setUploadStatusMessage('X-ray uploaded successfully!');
      setUploadStatusColor('text-green-500');

      // Update the xrayHistory state with the new X-ray
      const newXray = {
        [fileName]: {
          filepath: uploadResponse.data.fileUrl,
          date: new Date().toISOString().split('T')[0],
        },
      };
      setXrayHistory((prev) => ({ ...prev, ...newXray }));

      // Refresh the patient data
      if (refreshPatientData) {
        refreshPatientData();
      }

      // Close the modal after a delay
      setTimeout(() => {
        setIsUploadModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Error uploading x-ray:', error);
      setUploadStatusMessage('Failed to upload x-ray.');
      setUploadStatusColor('text-red-500');
    }
  };

  // Handle View All X-rays
  const handleViewAll = () => {
    setIsModalOpen(true);
    setSelectedXray(null);
    setViewMode('single');
    setSelectedXrays([]);
    setZoomLevel(1); // Reset zoom level
  };

  // Handle Modal Close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewMode('single');
    setSelectedXrays([]);
    setZoomLevel(1); // Reset zoom level
  };

  // Handle X-ray Selection
  const handleXrayClick = (filename, xrayData) => {
    if (viewMode === 'single') {
      setSelectedXray({ filename, ...xrayData });
      setDeleteStatusMessage('');
    } else {
      const alreadySelected = selectedXrays.find((xray) => xray.filename === filename);
      if (alreadySelected) {
        // Deselect the x-ray
        setSelectedXrays(selectedXrays.filter((xray) => xray.filename !== filename));
      } else {
        let maxSelection = viewMode === 'comparison' ? 2 : 4;
        if (selectedXrays.length < maxSelection) {
          // Select the x-ray
          setSelectedXrays([...selectedXrays, { filename, ...xrayData }]);
        }
      }
    }
    // Reset annotations when changing images
    setAnnotations([]);
    setCurrentAnnotation(null);
  };

  // Handle View Mode Change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSelectedXrays([]);
    setSelectedXray(null);
    setDeleteStatusMessage('');
    setAnnotations([]);
    setCurrentAnnotation(null);
  };

  // Handle X-ray Deletion
  const handleDeleteXray = async () => {
    if (!selectedXray) {
      setDeleteStatusMessage('Please select an X-ray to delete.');
      setDeleteStatusColor('text-red-500');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this X-ray?')) {
      return;
    }

    try {
      await deleteXray(patientId, selectedXray.filename);

      setDeleteStatusMessage('X-ray deleted successfully!');
      setDeleteStatusColor('text-green-500');

      // Update the xrayHistory state
      setXrayHistory((prev) => {
        const updated = { ...prev };
        delete updated[selectedXray.filename];
        return updated;
      });

      // Refresh the patient data
      if (refreshPatientData) {
        refreshPatientData();
      }

      // Clear the selected X-ray
      setSelectedXray(null);
    } catch (error) {
      console.error('Error deleting x-ray:', error);
      setDeleteStatusMessage('Failed to delete x-ray.');
      setDeleteStatusColor('text-red-500');
    }
  };

  if (!patient || !xrayHistory || Object.keys(xrayHistory).length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md h-1/2">
        <h2 className="text-lg font-semibold mb-4">X-Ray History</h2>
        <p className="text-gray-500">No X-ray history available.</p>
        {/* Upload Button */}
        <button
          onClick={handleUploadXrayClick}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Upload X-ray
        </button>

        {/* Upload X-ray Modal */}
        {isUploadModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
            onClick={handleUploadModalClose}
          >
            <div
              className="bg-white w-1/3 p-6 rounded-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-6 text-white hover:bg-red-400 bg-red-500 p-2 rounded-xl"
                onClick={handleUploadModalClose}
              >
                Close
              </button>

              <h2 className="text-xl font-bold mb-4">Upload X-ray</h2>

              {uploadStatusMessage && (
                <p className={`mb-4 ${uploadStatusColor}`}>{uploadStatusMessage}</p>
              )}

              <div className="mb-4">
                <label className="block text-gray-700">File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Enter file name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Select File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUploadXray}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-1/2 relative">
      <h2 className="text-lg font-semibold mb-4">X-Ray History</h2>
      <div className="space-y-4 overflow-y-auto h-5/6">
        {xrayHistory &&
          Object.entries(xrayHistory).map(([filename, xrayData]) => (
            <div key={filename} className="flex items-center">
              <img
                src={xrayData.filepath}
                alt={`X-ray ${filename}`}
                className="w-16 h-16 object-cover mr-4"
              />
              <div>
                <p>{filename}</p>
                <p>{xrayData.date}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Buttons */}
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <button
          onClick={handleViewAll}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          View All
        </button>
        {/* Remove the Upload X-ray button from here */}
        {/* <button
          onClick={handleUploadXrayClick}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Upload X-ray
        </button> */}
      </div>

      {/* Upload X-ray Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
          onClick={handleUploadModalClose}
        >
          <div
            className="bg-white w-1/3 p-6 rounded-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-6 text-white hover:bg-red-400 bg-red-500 p-2 rounded-xl"
              onClick={handleUploadModalClose}
            >
              Close
            </button>

            <h2 className="text-xl font-bold mb-4">Upload X-ray</h2>

            {uploadStatusMessage && (
              <p className={`mb-4 ${uploadStatusColor}`}>{uploadStatusMessage}</p>
            )}

            <div className="mb-4">
              <label className="block text-gray-700">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter file name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Select File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUploadXray}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          ></div>
          {/* Modal Content */}
          <div
            className="bg-white w-4/5 h-4/5 p-6 rounded-lg relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close and Upload Buttons */}
            <div className="absolute top-4 right-6 flex space-x-2">
              <button
                className="text-white hover:bg-red-400 bg-red-500 p-2 rounded-xl"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                onClick={handleUploadXrayClick}
                className="bg-green-500 text-white p-2 rounded-xl"
              >
                Upload X-ray
              </button>
            </div>

            {/* Upload X-ray Modal */}
            {isUploadModalOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={handleUploadModalClose}
              >
                <div
                  className="bg-white w-1/3 p-6 rounded-lg relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-6 text-white hover:bg-red-400 bg-red-500 p-2 rounded-xl"
                    onClick={handleUploadModalClose}
                  >
                    Close
                  </button>

                  <h2 className="text-xl font-bold mb-4">Upload X-ray</h2>

                  {uploadStatusMessage && (
                    <p className={`mb-4 ${uploadStatusColor}`}>{uploadStatusMessage}</p>
                  )}

                  <div className="mb-4">
                    <label htmlFor="file-name" className="block text-gray-700">File Name</label>
                    <input
                    id="file-name"
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      placeholder="Enter file name"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="select-file" className="block text-gray-700">Select File</label>
                    <input
                    id="select-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleUploadXray}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode Toggle Buttons */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => handleViewModeChange('single')}
                className={`py-2 px-4 rounded ${
                  viewMode === 'single' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Single View
              </button>
              <button
                onClick={() => handleViewModeChange('comparison')}
                className={`py-2 px-4 rounded ${
                  viewMode === 'comparison' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Comparison View
              </button>
              <button
                onClick={() => handleViewModeChange('quad')}
                className={`py-2 px-4 rounded ${
                  viewMode === 'quad' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Quad View
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-row h-full">
              {/* Left Side: Image Display */}
              <div className="flex-1 flex items-center justify-center overflow-hidden relative border">
                {/* Delete Button */}
                {selectedXray && viewMode === 'single' && (
                  <>
                  <button
                    onClick={handleDeleteXray}
                    className="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                     <button
                     onClick={() => setAnnotations([])}
                     className="absolute top-4 right-24 bg-blue-500 text-white py-2 px-4 rounded"
                   >
                     Clear Annotations
                   </button> 
                   </>
                )}

                {deleteStatusMessage && (
                  <p className={`absolute top-16 right-4 ${deleteStatusColor}`}>
                    {deleteStatusMessage}
                  </p>
                )}

                {viewMode === 'single' && selectedXray ? (
                  <div
                    className="max-h-full max-w-full overflow-auto relative"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  >
                    <img
                      src={selectedXray.filepath}
                      alt={`X-ray ${selectedXray.filename}`}
                      className="transform origin-top-left"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                    {/* Render existing annotations */}
                    {annotations.map((annotation, index) => (
                      <div
                        key={index}
                        className="absolute border border-red-500"
                        style={{
                          left: annotation.x * zoomLevel,
                          top: annotation.y * zoomLevel,
                          width: annotation.width * zoomLevel,
                          height: annotation.height * zoomLevel,
                        }}
                      ></div>
                    ))}
                    {/* Render current drawing annotation */}
                    {currentAnnotation && (
                      <div
                        className="absolute border border-blue-500"
                        style={{
                          left: currentAnnotation.x * zoomLevel,
                          top: currentAnnotation.y * zoomLevel,
                          width: currentAnnotation.width * zoomLevel,
                          height: currentAnnotation.height * zoomLevel,
                        }}
                      ></div>
                    )}
                  </div>
                ) : (viewMode === 'comparison' || viewMode === 'quad') &&
                  selectedXrays.length > 0 ? (
                  <div
                    className={`grid ${
                      viewMode === 'comparison' ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'
                    } gap-2 h-full w-full p-2`}
                  >
                    {selectedXrays.map((xray, index) => (
                      <div key={index} className="flex items-center justify-center border">
                        <img
                          src={xray.filepath}
                          alt={`X-ray ${xray.filename}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Select X-rays to view</p>
                )}
              </div>

              {/* Right Side: X-ray List */}
              <div className="w-1/3 overflow-y-auto ml-4">
                {/* X-ray List */}
                <ul className="space-y-2">
                  {Object.entries(xrayHistory).map(([filename, xrayData]) => {
                    const isSelected =
                      (viewMode === 'single' &&
                        selectedXray &&
                        selectedXray.filename === filename) ||
                      ((viewMode === 'comparison' || viewMode === 'quad') &&
                        selectedXrays.find((xray) => xray.filename === filename));

                    return (
                      <li
                        key={filename}
                        className={`flex items-center p-2 border rounded cursor-pointer ${
                          isSelected ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleXrayClick(filename, xrayData)}
                      >
                        <img
                          src={xrayData.filepath}
                          alt={`X-ray ${filename}`}
                          className="w-12 h-12 object-cover mr-2"
                        />
                        <div>
                          <p>{filename}</p>
                          <p>{xrayData.date}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

XrayHistory.propTypes = {
  patient: PropTypes.shape({
    nhiNumber: PropTypes.string,
    xrayHistory: PropTypes.objectOf(
      PropTypes.shape({
        filepath: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ),
  }),
  refreshPatientData: PropTypes.func,
};

export default XrayHistory;
