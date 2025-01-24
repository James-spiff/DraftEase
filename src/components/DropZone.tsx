//import useClipboard from "../hooks/useClipboard";

interface DropZoneProps {
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ handleDrop }) => {
    //const { handleDrop } = useClipboard();

  return (
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
  )
}

export default DropZone