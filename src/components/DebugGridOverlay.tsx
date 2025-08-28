import React from 'react';

interface DebugGridProps {
  rows: number;
  cols: number;
  width: number;
  height: number;
}

// This component renders a visual overlay showing grid lines and coordinates
const DebugGridOverlay: React.FC<DebugGridProps> = ({ rows, cols, width, height }) => {
  const rowHeight = height / rows;
  const colWidth = width / cols;
  
  // Generate lane markers (horizontal lines)
  const laneMarkers = [];
  for (let i = 0; i <= rows; i++) {
    const top = i * rowHeight;
    laneMarkers.push(
      <div 
        key={`lane-${i}`} 
        className="lane-marker"
        style={{ 
          top: `${top}px`,
          background: i % 2 === 0 ? 'rgba(255, 255, 0, 0.7)' : 'rgba(255, 255, 0, 0.4)'
        }}
      >
        {i < rows && (
          <div 
            style={{ 
              position: 'absolute', 
              left: '5px', 
              top: `${rowHeight/2 - 10}px`,
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '2px 5px',
              borderRadius: '4px',
              fontSize: '10px'
            }}
          >
            Row {i}
          </div>
        )}
      </div>
    );
  }
  
  // Generate column markers (vertical lines)
  const colMarkers = [];
  for (let i = 0; i <= cols; i++) {
    const left = i * colWidth;
    colMarkers.push(
      <div 
        key={`col-${i}`} 
        className="col-marker"
        style={{ 
          left: `${left}px`,
          background: i % 2 === 0 ? 'rgba(255, 255, 0, 0.7)' : 'rgba(255, 255, 0, 0.4)'
        }}
      >
        {i < cols && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '5px', 
              left: `${colWidth/2 - 10}px`,
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '2px 5px',
              borderRadius: '4px',
              fontSize: '10px'
            }}
          >
            Col {i}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="debug-grid-overlay">
      {laneMarkers}
      {colMarkers}
      
      {/* Debug toggle button */}
      <div 
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 2000
        }}
      >
        Debug Grid: ON
      </div>
    </div>
  );
};

export default DebugGridOverlay;