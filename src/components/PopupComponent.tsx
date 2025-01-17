import { useState, useEffect } from 'react';

function PopupComponent() {

  //Gets the setting from the local storage on load. 
  const [settings, setSettings] = useState<{ [key: string]: boolean }>(() => {
    const savedSettings = localStorage.getItem('draftEaseSettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          enableHeadings: true,
          enableBullets: true,
          enableParagraphs: true,
          enableBold: true,
          enableItalics: true,
          enableLinks: true,
        }; //If no settings are saved, default settings are applied
  });

  //Would be used with a button to reset to default settings whenever the user clicks
  const resetToDefaults = () => {
    const defaultSettings = {
      enableHeadings: true,
      enableBullets: true,
      enableParagraphs: true,
      enableBold: true,
      enableItalics: true,
      enableLinks: true,
    };
    setSettings(defaultSettings);
  };

  const [clipboardContent, setClipboardContent] = useState('');
  const [formattedContent, setFormattedContent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showFormatted, setShowFormatted] = useState(true); //for toggling between raw text view and formatted html view
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  //Save settings to local storage whenever it changes. This is like an autosave feature
  useEffect(() => {
    localStorage.setItem('draftEaseSettings', JSON.stringify(settings));
  }, [settings]);

  //updates the content in real time whenever the content or settings change
  useEffect(() => {
    if (clipboardContent) {
      setFormattedContent(formatContent(clipboardContent))
    }
  }, [clipboardContent, settings]);

  const handleTransferClick = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text.trim() === '') {
          setStatusMessage('Clipboard is empty.');
        } else {
          setClipboardContent(text);
          //console.log(clipboardContent)
          setFormattedContent(formatContent(text))
          setStatusMessage('Content fetched from clipboard!');
        }
      } else {
        setStatusMessage('Clipboard API is not supported in your browser.');
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      setStatusMessage('Failed to fetch clipboard content.');
    }
  };

  // Clear the clipboard and formatted content
  const clearContent = () => {
    setClipboardContent('');
    setFormattedContent('');
    setStatusMessage('Content cleared!');
  };

  //formatting function to convert the rich text to html
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line: string) => {

        //links
        if (settings.enableLinks) {
          const linkRegex = /\[(.*?)\]\((.*?)\)/g;
          line = line.replace(linkRegex, '<a href="$2">$1</a>');
        }

        //bold
        if (settings.enableBold) {
          const boldRegex = /\*\*(.*?)\*\*/g;
          line = line.replace(boldRegex, '<b>$1</b>');
        }

        //italics
        if (settings.enableItalics) {
          const italicsRegex = /\*(.*?)\*/g;
          line = line.replace(italicsRegex, '<i>$1</i>');
        }

        if (settings.enableHeadings && line.startsWith('# ')) {
            return `<h1>${line.slice(2)}</h1>`; //Heading 1
        } else if (settings.enableHeadings && line.startsWith('## ')) {
            return `<h2>${line.slice(3)}</h2>`; //Heading 2
        } else if (settings.enableBullets && line.startsWith('- ')) {
            return `<li>${line.slice(2)}</li>`; //Bullet point
        } else if (settings.enableParagraphs) {
            return `<p>${line}</p>`; // Paragraph
        } else {
            return ''; //skip the line if no formatting is applied
        }
    }).join('');
  };

  const wordCount = (text: string) => text.split(/\s+/).filter((word) => word).length;
  const charCount = (text: string) => text.length;

  const handleToggleView = () => {
    setShowFormatted(!showFormatted);
  }

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  //copies the formatted content back to the clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedContent);
      setStatusMessage('Formatted content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setStatusMessage('Failed to copy content')
    }
  }

  const updateSettings = (key: string, value: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, [key]: value }));
  } //Updates the specific setting based on user interaction

  //Downloads the formatted content as a HTML file
  const saveToFile = () => {
    const blob = new Blob([formattedContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted-content.html';
    link.click();
  };

  //Adds Drag and Drop support
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/plain' ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setClipboardContent(e.target?.result as string);
        setFormattedContent(formatContent(e.target?.result as string));
        setStatusMessage('File loaded!')
      };
      reader.readAsText(file);
    } else {
      setStatusMessage('Please drop a valid .txt file.');
    }
  }

  // make it so that the Show Raw Text button only displays when the Transfer Content button has been clicked
  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: theme === 'light' ? '#f9f9f9' : '#212529',
        color: theme === 'light' ? '#212529' : '#f8f9fa',
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.6',
      }}
    >
      <h2 style={{ color: '#007bff', textAlign: 'center' }}>DraftEase</h2>
      {/* Buttons Container */}
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
            //margin: '10px 0' 
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            //marginBottom: '15px',
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
        {/* <textarea
          value={clipboardContent}
          readOnly
          style={{ width: '100%', height: '100px', marginTop: '10px' }}
          placeholder="Clipboard content will appear here..."
        /> */}
        
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
          onClick={saveToFile}
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
      {/* <br /> */}
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '150px',
          border: '2px dashed #007bff',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'f9f9f9',
          color: '#6c757d',
          textAlign: 'center',
          marginBottom: '15px',
          transition: 'border-color 0.3s, background-color 0.3s',
        }}
        onDragEnter={(e) => {
          e.currentTarget.style.borderColor = '#0056b3';
          e.currentTarget.style.backgroundColor = '#e9ecef'
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = '#007bff';
          e.currentTarget.style.backgroundColor = '#f9f9f9';
        }}
      >
        Drag and drop a .txt file here
      </div>

      {/* Formatting Options */}
      <div>
        <h3>Formatting Options:</h3>
        {Object.entries(settings).map(([key, value]) => (
          <label key={key} style={{ display: 'block', marginBottom: '5px'}}>
            <input 
              type="checkbox"
              checked={value}
              onChange={(e) => updateSettings(key, e.target.checked)}
            />
            {`Enable ${key.replace('enable', '').trim()}`}
          </label>
        ))}
      </div>
              
      {/* Responsive Live Stats */}
      <div
        style={{
          marginTop: '20px',
          fontSize: '14px',
          color: theme === 'light' ? '#555' : 'white',
          textAlign: 'center',
        }}
      >
        <h4>Live Stats:</h4>
        <p>Raw Content: {charCount(clipboardContent)} characters, {wordCount(clipboardContent)} words</p>
        <p>Formatted Content: {charCount(formattedContent)} characters, {wordCount(formattedContent)} words</p>
      </div>
      {showFormatted ? (
        <div 
            style={{
                width: '100%',
                height: '150px',
                overflowY: 'auto',
                marginTop: '10px',
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: '#f9f9f9',
            }}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      ) : (
        <textarea 
            value={clipboardContent}
            //readOnly
            onChange={(e) => setClipboardContent(e.target.value)}
            style={{
                width: '100%',
                height: '150px',
                marginTop: '10px',
                marginRight: '5px',
                border: '1px solid #ccc',
            }}
        />
      )}
      <button
        onClick={handleToggleView}
        title="Toggle between raw text and formatted view"
        style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#138496')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#17a2b8')}
      >
        {showFormatted ? 'Show Raw Text' : 'Show Formatted View'}
      </button>
      <button
        onClick={toggleTheme}
        title="Toggle between light and dark theme"
        style={{ 
          //marginLeft: '10px', 
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer', 
        }}
      >
        Toggle Theme
      </button>
    </div>
  );
}

export default PopupComponent;
