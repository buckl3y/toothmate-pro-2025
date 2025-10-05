import PropTypes from "prop-types"
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ChartOptions(
    {treatmentVisibility, setTreatmentVisibility,
    view, handleViewChanged, resetView,
    toggleVisibility, visibility, 
}
) {

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* View Controls */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 16 }}>
                {/* Left: Camera Reset */}
                <div style={{ flex: 1 }}>
                    <button id="camera-reset-button" className="btn-secondary" onClick={resetView}>↺</button>
                </div>

                {/* Center: View Buttons */}
                <div style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <button
                        id="view-change-mouth"
                        className={view=="mouth" ? "btn" : "btn-secondary"}
                        onClick={() => handleViewChanged("mouth")}
                    >
                        Mouth
                    </button>
                    <button
                        id="view-change-grid"
                        className={view=="grid" ? "btn" : "btn-secondary"}
                        onClick={() => handleViewChanged("grid")}
                    >
                        Grid
                    </button>
                    <button
                        id="view-change-xray"
                        className={view=="xray" ? "btn" : "btn-secondary"}
                        onClick={() => handleViewChanged("xray")}
                    >
                        X-Ray
                    </button>
                </div>

                {/* Right: Visibility */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" onClick={toggleVisibility}>
                        {visibility ? <ChevronDown/> : <ChevronUp/>}
                    </button>
                </div>
            </div>
            {/* Options Panel */}
            {visibility && 
            <div style={{ display: 'flex', width: '100%', padding: '7px 32px' }}>
                {/* Treatments */}
                <div style={{ flex: 1 }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <input
                                type="checkbox"
                                style={{ marginRight: 6 }}
                                onChange={e => setTreatmentVisibility(prev => ({ ...prev, all: e.target.checked }))}
                                checked={treatmentVisibility.all}
                            />
                            Treatments:
                        </label>
                        {treatmentVisibility.all && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[
                                    { key: 'filling', label: 'Fillings', color: '#C00A0A' },
                                    { key: 'crown', label: 'Crowns', color: '#FF5100' },
                                    { key: 'rootCanal', label: 'Root Canals', color: '#0080FF' },
                                    { key: 'extraction', label: 'Extractions', color: '#EEEEEE', border: '2px solid black' },
                                    { key: 'implant', label: 'Implants', color: '#007610' },
                                    { key: 'veneer', label: 'Veneers', color: '#7B00FF' },
                                    { key: 'sealant', label: 'Sealant', color: '#FF0099' }
                                ].map(({ key, label, color, border }) => (
                                    <label key={key} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span
                                            className="legend-colour"
                                            style={{
                                                background: color,
                                                border: border || undefined,
                                                marginRight: 6
                                            }}
                                        />
                                        <input
                                            type="checkbox"
                                            style={{ marginRight: 6 }}
                                            onChange={e => setTreatmentVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                                            checked={treatmentVisibility[key]}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Conditions */}
                <div style={{ flex: 1, padding: '0 32px', background: '#f5f5f5', borderRadius: 8 }}>
                    {/* Add condition controls here */}
                    <div style={{ padding: 8 }}>
                        <h5>Conditions...</h5>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

ChartOptions.propTypes = {
    treatmentVisibility: PropTypes.shape({
        all: PropTypes.bool.isRequired,
        filling: PropTypes.bool.isRequired,
        crown: PropTypes.bool.isRequired,
        rootCanal: PropTypes.bool.isRequired,
        extraction: PropTypes.bool.isRequired,
        implant: PropTypes.bool.isRequired,
        veneer: PropTypes.bool.isRequired,
        sealant: PropTypes.bool.isRequired,
    }).isRequired,
    setTreatmentVisibility: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    handleViewChanged: PropTypes.func.isRequired,
    resetView: PropTypes.func.isRequired,
    toggleVisibility: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired
};