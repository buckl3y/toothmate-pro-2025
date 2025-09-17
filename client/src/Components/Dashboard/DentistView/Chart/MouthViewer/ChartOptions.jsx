import PropTypes from "prop-types"

export default function ChartOptions(
    {treatmentVisibility, setTreatmentVisibility,
    is3DView, handleViewChanged, resetView,
    toggleVisibility
}
) {

    return (
        
        <div style={{
            width: '100%', height: '100%'
        }}>
            <p className="text-center" onClick={toggleVisibility}> Chart View Options </p>

            {/* Flex container creates column layout for options*/}
            <div style={{display: 'flex'}}>
            
                {/* Block layout creates vertical layout for each column */}
                <div style={{display: 'block'}}>
                    {is3DView ? (
                        <>
                        <button id="view-change-button" className='btn' onClick={() => handleViewChanged(!is3DView)}>
                            3D
                        </button>
                        <button id="view-change-button" className='btn-secondary' onClick={() => handleViewChanged(!is3DView)}>
                            Grid
                        </button>
                        </>
                    ) : (
                        <>
                        <button id="view-change-button" className='btn-secondary' onClick={() => handleViewChanged(!is3DView)}>
                            3D
                        </button>
                        <button id="view-change-button" className='btn' onClick={() => handleViewChanged(!is3DView)}>
                            Grid
                        </button>
                        </>
                    )}
                    <br />
                    <button id='camera-reset-button' className='btn-secondary' onClick={() => resetView()}>To Front</button>
                </div>

                <div style={{display: 'block'}}>
                    <h4 className="text-center">Show:</h4>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'block'}}>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="checkbox" 
                                        style={{ marginRight: 6 }} 
                                        onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, all: e.target.checked}})} 
                                        checked={treatmentVisibility.all} 
                                    />
                                    Treatments:
                                </label>
                                {treatmentVisibility.all && (
                                    <>
                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ background: "#C00A0A" }} className='legend-colour' />
                                            <input 
                                                type="checkbox" 
                                                style={{ marginRight: 6 }} 
                                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, filling: e.target.checked}})} 
                                                checked={treatmentVisibility.filling} 
                                            />
                                            Fillings
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ background: "#FF5100" }} className='legend-colour' />
                                            <input 
                                                type="checkbox" 
                                                style={{ marginRight: 6 }} 
                                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, crown: e.target.checked}})} 
                                                checked={treatmentVisibility.crown} 
                                            />
                                            Crowns
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ background: "#0080FF" }} className='legend-colour' />
                                            <input 
                                                type="checkbox" 
                                                style={{ marginRight: 6 }} 
                                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, rootCanal: e.target.checked}})} 
                                                checked={treatmentVisibility.rootCanal} 
                                            />
                                            Root Canals
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ background: "#EEEEEE", borderColor: "black", borderWidth: "2px" }} className='legend-colour' />
                                            <input 
                                                type="checkbox" 
                                                style={{ marginRight: 6 }} 
                                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, extraction: e.target.checked}})} 
                                                checked={treatmentVisibility.extraction} 
                                            />
                                            Extractions
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ background: "#007610" }} className='legend-colour' />
                                            <input 
                                                type="checkbox" 
                                                style={{ marginRight: 6 }} 
                                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, implant: e.target.checked}})} 
                                                checked={treatmentVisibility.implant} 
                                            />
                                            Implants
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ background: "#7B00FF" }} className='legend-colour' />
                                            <input 
                                                type="checkbox" 
                                                style={{ marginRight: 6 }} 
                                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, veneer: e.target.checked}})} 
                                                checked={treatmentVisibility.veneer} 
                                            />
                                            Veneers
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ background: "#FF0099" }} className='legend-colour' />
                                            <input 
                                                type="checkbox" 
                                                style={{ marginRight: 6 }} 
                                                onChange={(e) => setTreatmentVisibility(previousState => { return {...previousState, sealant: e.target.checked}})} 
                                                checked={treatmentVisibility.sealant} 
                                            />
                                            Sealant
                                        </label>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
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
    is3DView: PropTypes.bool.isRequired,
    handleViewChanged: PropTypes.func.isRequired,
    resetView: PropTypes.func.isRequired,
    toggleVisibility: PropTypes.func.isRequired
};