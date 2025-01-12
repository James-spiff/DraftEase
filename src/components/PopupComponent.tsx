import { useState, useEffect } from 'react';

function PopupComponent() {

  //Gets the setting from the local storage on load. 
  const [settings, setSettings] = useState(() => {
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
  
  //Save settings to local storage whenever it changes. This is like an autosave feature
  useEffect(() => {
    localStorage.setItem('draftEaseSettings', JSON.stringify(settings));
  }, [settings]);

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

  const handleToggleView = () => {
    setShowFormatted(!showFormatted);
  }

  const updateSettings = (key: string, value: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, [key]: value }));
  } //Updates the specific setting based on user interaction

  // make it so that the Show Raw Text button only displays when the Transfer Content button has been clicked
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>DraftEase</h2>
      <button onClick={handleTransferClick} style={{ margin: '10px 0' }}>
        Transfer Content
      </button>
      {statusMessage && <p>{statusMessage}</p>}
      {/* <textarea
        value={clipboardContent}
        readOnly
        style={{ width: '100%', height: '100px', marginTop: '10px' }}
        placeholder="Clipboard content will appear here..."
      /> */}
      <button
        onClick={handleToggleView}
        style={{
            margin: '10px 0',
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
        }}
      >
        {showFormatted ? 'Show Raw Text' : 'Show Formatted View'}
      </button>
      <br />
      <button
        onClick={resetToDefaults}
        style={{
          margin: '10px 0',
          padding: '5px 10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Reset Formatting
      </button>
      <div>
        <h3>Formatting Options:</h3>
        <label>
            <input 
                type="checkbox"
                checked={settings.enableHeadings}
                onChange={(e) => updateSettings('enableHeadings', e.target.checked)}
            />
            Enable Headings
        </label>
        <br />
        <label>
            <input 
                type="checkbox"
                checked={settings.enableBullets}
                onChange={(e) => updateSettings('enableBullets', e.target.checked)}
            />
            Enable Bullets
        </label>
        <br />
        <label>
            <input 
                type="checkbox"
                checked={settings.enableParagraphs}
                onChange={(e) => updateSettings('enableParagraphs', e.target.checked)}
            />
            Enable Paragraphs
        </label>
        <br />
        <label>
          <input 
            type="checkbox"
            checked={settings.enableBold}
            onChange={(e) => updateSettings('enableBold', e.target.checked)}
          />
          Enable Bold
        </label>
        <br />
        <label>
          <input 
            type="checkbox"
            checked={settings.enableItalics}
            onChange={(e) => updateSettings('enableItalics', e.target.checked)}
          />
          Enable Italics
        </label>
        <br />
        <label>
          <input 
            type="checkbox"
            checked={settings.enableLinks}
            onChange={(e) => updateSettings('enableLinks', e.target.checked)}
          />
          Enable Links
        </label>
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
            readOnly
            style={{
                width: '100%',
                height: '150px',
                marginTop: '10px',
                border: '1px solid #ccc',
            }}
        />
      )}
    </div>
  );
}

export default PopupComponent;
