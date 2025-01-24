//import useClipboard from '../hooks/useClipboard'
import { charCount, wordCount } from '../utils/formatHelpers'
import { useTheme } from '../hooks/useTheme';

interface LiveStatsProps {
  clipboardContent: string;
  formattedContent: string;
}

const LiveStats:React.FC<LiveStatsProps> = ({ clipboardContent, formattedContent }) => {

    //const { clipboardContent, formattedContent } = useClipboard();
    const { theme } = useTheme();

  return (
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
  )
}

export default LiveStats