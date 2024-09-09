import React, { useState } from "react";
import { FaVideo, FaMusic, FaFileAlt } from "react-icons/fa"; // Icons for buttons

function App() {
  const [url, setUrl] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadType, setDownloadType] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:4000';

const handleDownload = async (type) => {
  if (!url.trim()) {
    setError("Please enter a link.");
    return;
  }
  
  setIsLoading(true);
  setError("");
  setDownloadLink("");
  setDownloadType(type);
  
  try {
    const response = await fetch(`${backendUrl}/download/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const link = window.URL.createObjectURL(blob);

    let extension = "";
    if (type === "video") {
      extension = ".mp4";
    } else if (type === "audio") {
      extension = ".mp3";
    } else if (type === "subtitles") {
      extension = ".txt";
    }

    setDownloadLink({ url: link, extension });
  } catch (error) {
    console.error(`Error downloading ${type}:`, error);
    setError("Link not valid or server error.");
  } finally {
    setIsLoading(false);
    setUrl("");
  }
};


  const downloadTypeLabels = {
    video: "Video",
    audio: "Audio",
    subtitles: "Subtitles",
  };

  const renderPreview = () => {
    if (!downloadLink.url) return null;

    const previewStyle = "mx-auto";
    // Center alignment and margin for vertical spacing

    if (downloadType === "video") {
      return <video controls src={downloadLink.url} className={`w-[300px] h-[450px] ${previewStyle}`} />;
    } else if (downloadType === "audio") {
      return <audio controls src={downloadLink.url} className={`w-[300px] ${previewStyle}`} />;
    } else if (downloadType === "subtitles") {
      return (
        <iframe
          src={downloadLink.url}
          className={`w-[800px] ${previewStyle}`}
          style={{ height: 'auto', border: 'none' }}
          title="Subtitles Preview"
        />
      );
    }
    return null;
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-0">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold mr-4">Reel Transcribe AI</h1>
            <img src="/icon.png" alt="App Icon" className="w-6 h-6 md:w-8 md:h-8" />
          </div>
        </div>
      </header>

      <main className="flex-grow bg-black p-4 md:pt-10">
        <div className="container mx-auto text-center">
          <h1 className="mb-4 text-2xl md:text-4xl font-extrabold">Reel Link to Transcription</h1>
          <p className="mb-8 text-sm md:text-lg font-medium">Paste the URL of the reel you want to download or transcribe.</p>

          <div className="mb-8">
            <input
              type="text"
              placeholder="Paste Reel URL here"
              className="w-full md:w-[50rem] px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                type="button"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition duration-300"
                onClick={() => handleDownload("video")}
                disabled={isLoading}
              >
                <FaVideo /> {isLoading && downloadType === "video" ? "Please wait..." : "Download Video"}
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition duration-300"
                onClick={() => handleDownload("audio")}
                disabled={isLoading}
              >
                <FaMusic /> {isLoading && downloadType === "audio" ? "Please wait..." : "Download Audio"}
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition duration-300"
                onClick={() => handleDownload("subtitles")}
                disabled={isLoading}
              >
                <FaFileAlt /> {isLoading && downloadType === "subtitles" ? "Please wait..." : "Download Subtitles"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
          {isLoading && (
            <img src="/SVKL.gif" alt="Loading..." className="mx-auto" />
          )}
          {renderPreview()}
          {downloadLink && (
            <div className="mt-1">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = downloadLink.url;
                  link.download = `${downloadType}${downloadLink.extension}`;
                  link.click();
                }}
              >
                Download {downloadTypeLabels[downloadType] || "File"}
              </button>

            </div>
          )}

          {/* Additional Information Sections */}
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-left">How to Use</h2>
            <p className="text-sm md:text-lg mb-4 text-left">
              1. Paste the URL of the reel you want to transcribe or download in the input field above.
              <br />
              2. Choose the type of content you want to download (Video, Audio, or Subtitles).
              <br />
              3. Click the corresponding button to start the download process.
              <br />
              4. Before downloading, you can preview or download the file directly from the buttons below.
            </p>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-left">What We Serve</h2>
            <p className="text-sm md:text-lg mb-4 text-left">
              Our service allows you to easily download and transcribe reels from various platforms. We offer the following options:
              <br />
              <li><b>Video</b>: Download the reel video in MP4 format.</li>
              <li><b>Audio</b>: Extract and download the audio from the reel in MP3 format.</li>
              <li><b>Subtitles</b>: Get the transcribed text of the reel in TXT format.</li>
              Enjoy a seamless experience with fast and reliable downloads!
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-auto shadow-inner">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Sahil and Vansh. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;