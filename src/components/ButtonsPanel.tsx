//import React from 'react'
import { useSettings } from '../hooks/useSettings';
import { saveToFile } from '../utils/fileHelpers'

interface ButtonsPanelProps {
  handleTransferClick: () => void;
  handleCopyToClipboard: () => void;
  clearContent: () => void;
  statusMessage: string;
  formattedContent: string;
}

const ButtonsPanel: React.FC<ButtonsPanelProps> = ({ handleTransferClick, handleCopyToClipboard, clearContent, statusMessage, formattedContent }) => {

    const { resetToDefaults } = useSettings();

  return (
    <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '15px',
        }}
      >
        <button 
          onClick={handleTransferClick}
          title="Fetch content from the clipboard and format it" 
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Transfer Content
        </button>
        <button
          onClick={handleCopyToClipboard}
          title="Copy the formatted content back to the clipboard"
          style={{ 
            //margin: '10px 5px', 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            //marginLeft: '10px',
            transition: 'background-color 0.3s',
          }}
        >
          Copy Formatted Content
        </button>
        {statusMessage && (
          <p
            style={{
              marginTop: '10px',
              fontSize: '14px',
              color: statusMessage.includes('loaded') ? '#28a745' : '#dc3545'
            }}
          >
            {statusMessage}
          </p>
        )}
        
        {/* <br /> */}
        <button
          onClick={clearContent}
          title="Clear the clipboard and formatted content"
          style={{
            margin: '10px 0',
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            borderRadius: '5px',
            color: 'black',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Clear Content
        </button>
        {/* <br /> */}
        <button
          onClick={() => saveToFile(formattedContent)}
          title="Save the formatted content as a text file"
          style={{ margin: '10px 5px', padding: '10px 20px', backgroundColor: '#007bff'}}
        >
          Save to File
        </button>
        <button
          onClick={resetToDefaults}
          title="Reset all settings to their default values"
          style={{
            margin: '10px 0',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            borderRadius: '5px',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reset Formatting
        </button>
      </div>
  )
}

export default ButtonsPanel