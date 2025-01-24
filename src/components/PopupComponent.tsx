import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useSettings } from '../hooks/useSettings'
import ButtonsPanel from './ButtonsPanel'
import DropZone from './DropZone'
import LiveStats from './LiveStats'

const PopupComponent = () => {

  interface SettingsType {
    enableLinks: boolean;
    enableBold: boolean;
    enableItalics: boolean;
    enableHeadings: boolean;
    enableBullets: boolean;
    enableParagraphs: boolean;
  }

  //const { handleDrop, formattedContent, showFormatted, clipboardContent, setClipboardContent, handleToggleView } = useClipboard();
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  
      const [clipboardContent, setClipboardContent] = useState('');
      const [formattedContent, setFormattedContent] = useState('');
      const [statusMessage, setStatusMessage] = useState('');
      const [showFormatted, setShowFormatted] = useState(true); //for toggling between raw text view and formatted html view
  
      //formatting function to convert the rich text to html
      const formatContent = (text: string, settings: SettingsType) => {
          //console.log("Inside formatContent:", text);
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
                  return null; //skip the line if no formatting is applied
              }
          })
          .filter(Boolean)
          .join('');
      };
  
      useEffect(() => {
          // Recalculate formatted content whenever clipboard content changes
          setFormattedContent(formatContent(clipboardContent, settings));
      }, [clipboardContent, settings]);
  
      const handleTransferClick = async () => {
          try {
              if (navigator.clipboard) {
                  const text = await navigator.clipboard.readText();
                  // console.log('Raw clipboard content:', text);
                  // console.log(formatContent('## Test heading\n- Bullet point\n**Bold text**\n*Italic text*', settings));
      
                  if (text.trim() === '') {
                      setStatusMessage('Clipboard is empty.');
                      return;
                  }
      
                  setClipboardContent(text);
                  console.log('Clipboard content state is set: ', clipboardContent);
      
                  // Generate formatted content
                  console.log("This is the text", text)
                  const formatted = formatContent(text, settings);
                  console.log('Formatted clipboard content:', formatted);
      
                  // Validate the formatted content
                  if (formatted.trim() === '') {
                      setStatusMessage('Formatted content is empty or invalid.');
                      return;
                  }
      
                  // Set the formatted content if valid
                  setFormattedContent(formatted);
                  setStatusMessage('Content fetched from clipboard!');
              } else {
                  setStatusMessage('Clipboard API is not supported in your browser.');
              }
          } catch (error) {
              console.error('Failed to read clipboard:', error);
              setStatusMessage('Failed to fetch clipboard content.');
          }
      };
  
        useEffect(() => {
          //console.log(formatContent('## Test heading\n- Bullet point\n**Bold text**\n*Italic text*'));
          console.log('Clipboard content updated:', clipboardContent);
          console.log('Formatted content updated:', formattedContent);
      }, [clipboardContent, formattedContent]);
  
      
      /**
       * Clears clipboard content and the local state.
       */
      const clearContent = () => {
          setClipboardContent('');
          setFormattedContent('')
          setStatusMessage('Content cleared!');
      };
  
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
  
      const handleToggleView = () => {
          setShowFormatted(!showFormatted);
      }
  
      //Adds Drag and Drop support
      const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type === 'text/plain' ) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  setClipboardContent(e.target?.result as string);
                  setFormattedContent(formatContent(e.target?.result as string, settings));
                  setStatusMessage('File loaded!')
              };
          reader.readAsText(file);
          } else {
              setStatusMessage('Please drop a valid .txt file.');
          }
      }
  

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
      <ButtonsPanel 
        handleTransferClick={handleTransferClick} 
        clearContent={clearContent} 
        handleCopyToClipboard={handleCopyToClipboard}  
        statusMessage={statusMessage}
        formattedContent={formattedContent}
      />
      <DropZone handleDrop={handleDrop} />
      {/* <FormattingOptions /> */}
      <div>
        <h3>Formatting Options:</h3>
        {Object.entries(settings).map(([key, value]) => (
          <label key={key} style={{ display: 'block', marginBottom: '5px'}}>
            <input 
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => updateSettings(key as keyof SettingsType, e.target.checked)}
            />
            {`Enable ${key.replace('enable', '').trim()}`}
          </label>
        ))}
      </div>
      <LiveStats 
        clipboardContent={clipboardContent}
        formattedContent={formattedContent}
      />
      {showFormatted ? (
        <div 
            style={{
                width: '100%',
                height: '150px',
                overflowY: 'auto',
                color: 'black',
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
            readOnly //comment out if you want users to be able to edit the content
            onChange={(e) => setClipboardContent(e.target.value as string)} //comment out if you want users to be able to edit the content
            style={{
                width: '100%',
                height: '150px',
                color: 'black',
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
  )
}

export default PopupComponent