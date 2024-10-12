import { useState } from 'react';

interface ReportDownloadButtonProps {
  reportType: string;
}

const ReportDownloadButton = ({ reportType }: ReportDownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle report download
  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/reports/download?type=${reportType}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Convert the response to a Blob (binary large object)
      const blob = await response.blob();

      // Create a link element and trigger a download
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `${reportType}_report.pdf`; // Set the filename
      downloadLink.click(); // Trigger the download

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Error downloading report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating...' : `Download ${reportType} Report`}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ReportDownloadButton;