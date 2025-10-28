import PropTypes from "prop-types"
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * Options panel to be displayed below the chart viewer.
 * Provides options to switch view types, hide certain procedures and conditions, and reset cameras.
 * Can be hidden to enable full height chart view.
 * 
 * @author Skye Pooley
 * 
 */
export default function ChartOptions(
    {treatmentVisibility, setTreatmentVisibility,
    conditionVisibility, setConditionVisibility,
    view, handleViewChanged, resetView,
    toggleVisibility, visibility, 
}
) {

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* View Controls */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 8 }}>
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
                <div style={{ flex: 1, borderRadius: 8 }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <input
                                type="checkbox"
                                style={{ marginRight: 6 }}
                                onChange={e => setConditionVisibility(prev => ({ ...prev, all: e.target.checked }))}
                                checked={conditionVisibility.all}
                            />
                            Conditions:
                        </label>
                        {conditionVisibility.all && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[
                                    { key: 'erosion', label: 'Erosion', color: '#C00A0A' },
                                    { key: 'partialEruption', label: 'Partial Eruption', color: '#EEEEEE', border: '2px solid black' },
                                    { key: 'acidWear', label: 'Acid Wear', color: '#efff5fff' },
                                    { key: 'bruxism', label: 'Bruxism',  color: '#5b609eff'},
                                    { key: 'grooving', label: 'Grooving', color: '#007610' },
                                    { key: 'discolouration', label: 'Discolouration', color: '#614c2bff' },
                                    { key: 'fracture', label: 'Fractures', color: '#ffa735ff' }
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
                                            onChange={e => setConditionVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                                            checked={conditionVisibility[key]}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        )}
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
    conditionVisibility: PropTypes.shape({
        all: PropTypes.bool.isRequired,
        erosion: PropTypes.bool.isRequired,
        partialEruption: PropTypes.bool.isRequired,
        acidWear: PropTypes.bool.isRequired,
        bruxism: PropTypes.bool.isRequired,
        grooving: PropTypes.bool.isRequired,
        discolouration: PropTypes.bool.isRequired,
        fracture: PropTypes.bool.isRequired,
    }).isRequired,
    setConditionVisibility: PropTypes.func.isRequired,
    setTreatmentVisibility: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    handleViewChanged: PropTypes.func.isRequired,
    resetView: PropTypes.func.isRequired,
    toggleVisibility: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired
};