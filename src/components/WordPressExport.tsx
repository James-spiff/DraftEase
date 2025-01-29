import React from 'react'


interface WordPressExportProps {
    wordpressURL: string;
    setWordpressURL: React.Dispatch<React.SetStateAction<string>>;
    wordpressUsername: string;
    setWordpressUsername: React.Dispatch<React.SetStateAction<string>>;
    wordpressAppPassword: string;
    setWordpressAppPassword: React.Dispatch<React.SetStateAction<string>>;
}
  

const WordPressExport: React.FC<WordPressExportProps> = ({
    wordpressURL,
    setWordpressURL,
    wordpressUsername,
    setWordpressUsername,
    wordpressAppPassword,
    setWordpressAppPassword
}) => {
    
  return (
    <div style={{ marginTop: '20px' }}>
        <h3>WordPress Export Settings</h3>
        <label>
            WordPress Site URL:
            <input 
                type="text"
                value={wordpressURL}
                onChange={(e) => setWordpressURL(e.target.value)}
                placeholder='https://your-wordpress-site.com'
                style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
        </label>
        <label>
            Username:
            <input 
                type="text"
                value={wordpressUsername}
                onChange={(e) => setWordpressUsername(e.target.value)}
                placeholder='Your Wordpress username'
                style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
        </label>
        <label>
            Application Password:
            <input 
                type="password"
                value={wordpressAppPassword}
                onChange={(e) => setWordpressAppPassword(e.target.value)}
                placeholder='Your application password'
                style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
        </label>
    </div>
  )
}

export default WordPressExport