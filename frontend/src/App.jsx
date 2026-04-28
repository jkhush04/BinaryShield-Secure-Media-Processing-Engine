import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const postForm = async (endpoint, formData, expectBlob = false, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_BASE}${endpoint}`);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (expectBlob) {
          resolve(xhr.response);
        } else {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
        }
      } else {
        reject(new Error(xhr.responseText || "Request failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.responseType = expectBlob ? "blob" : "text";

    xhr.send(formData);
  });
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    <span className="progress-text">{progress}%</span>
  </div>
);

const FileDrop = ({ name, accept, multiple = false, placeholder }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (files) => {
    if (files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input = e.currentTarget.querySelector(`input[name="${name}"]`);
      if (input) {
        const dt = new DataTransfer();
        for (let file of files) {
          dt.items.add(file);
        }
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        handleFileChange(dt.files);
      }
    }
  };

  const handleClick = (e) => {
    if (e.target.tagName !== 'INPUT') {
      const input = e.currentTarget.querySelector(`input[name="${name}"]`);
      if (input) input.click();
    }
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    const input = document.querySelector(`input[name="${name}"]`);
    if (input) {
      input.value = '';
    }
  };

  return (
    <div
      className={`file-drop ${dragOver ? 'drag-over' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input type="file" name={name} accept={accept} multiple={multiple} onChange={handleInputChange} />
      {selectedFiles.length > 0 ? (
        <div className="file-list">
          <p className="file-count">✓ {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected</p>
          <div className="file-names">
            {selectedFiles.map((file, idx) => (
              <span key={idx} className="file-name">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ))}
          </div>
          <button type="button" className="clear-btn" onClick={(e) => { e.stopPropagation(); clearFiles(); }}>
            Clear Files
          </button>
        </div>
      ) : (
        <p className="drop-text">{placeholder}</p>
      )}
    </div>
  );
};

const tabs = [
  //{ id: "validate", title: "Validate File" },
  { id: "image", title: "Image Converter" },
  { id: "video", title: "Video Converter" },
  { id: "pdf", title: "Images → PDF" },
 // { id: "health", title: "Health Check" },
];

function App() {
  const [activeTab, setActiveTab] = useState("validate");
  const [status, setStatus] = useState("");
  const [imageResult, setImageResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetState = () => {
    setStatus("");
    setImageResult(null);
    setProgress(0);
  };

   const handleValidateFile = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Uploading...");

    const file = event.target.file.files[0];
    if (!file) {
      setStatus("Please choose a file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await postForm("/upload", formData);
      setStatus(`✅ Success: ${data.message} (mime: ${data.detectedType.mime}, ext: ${data.detectedType.ext})`);
    } catch (error) {
      setStatus(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }; 

  const handleConvertImage = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Converting image...");
    setImageResult(null);

    const file = event.target.file.files[0];
    const width = event.target.width.value;
    const height = event.target.height.value;
    const format = event.target.format.value;
    const quality = event.target.quality.value;

    if (!file) {
      setStatus("Please choose an image.");
      setLoading(false);
      return;
    }

    const query = new URLSearchParams({
      width: width || undefined,
      height: height || undefined,
      format,
      quality: quality || undefined,
    }).toString();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const blob = await postForm(`/images/convert?${query}`, formData, true);
      const objectUrl = URL.createObjectURL(blob);
      setImageResult({ url: objectUrl, blob, format });
      setStatus("✅ Image converted successfully.");
    } catch (error) {
      setStatus(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertVideo = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Converting video...");
    setProgress(0);

    const file = event.target.file.files[0];
    const format = event.target.format.value;
    if (!file) {
      setStatus("Please select a video first.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const blob = await postForm("/videos/process", formData, true, (percent) => {
        setProgress(percent);
        setStatus(`Converting video... ${percent}%`);
      });
      downloadBlob(blob, `converted.${format}`);
      setStatus("✅ Video converted. Download started.");
      setProgress(100);
    } catch (error) {
      setStatus(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePdf = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("Building PDF...");
    setProgress(0);

    const files = event.target.images.files;
    if (!files.length) {
      setStatus("Please choose at least one image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const blob = await postForm("/pdf/images-to-pdf", formData, true, (percent) => {
        setProgress(percent);
        setStatus(`Building PDF... ${percent}%`);
      });
      downloadBlob(blob, "output.pdf");
      setStatus("✅ PDF generated. Download started.");
      setProgress(100);
    } catch (error) {
      setStatus(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      /* case "validate":
        return (
          <section className="section">
            <h2>Validate a file using the backend</h2>
            <form onSubmit={handleValidateFile}>
              <FileDrop name="file" accept="*/
            /*  *"placeholder="Drag & drop a file here or click to browse" /> 
              <button type="submit" disabled={loading}>
                {loading ? "Validating…" : "Validate"}
              </button>
            </form>
          </section>
        ); */
      case "image":
        return (
          <section className="section">
            <h2>Convert an image with width, height, format, and quality</h2>
            <form onSubmit={handleConvertImage}>
              <FileDrop name="file" accept="image/*" placeholder="Drag & drop an image here or click to browse" />
              <div className="grid">
                <label>
                  Width
                  <input type="number" name="width" placeholder="auto" min="1" />
                </label>
                <label>
                  Height
                  <input type="number" name="height" placeholder="auto" min="1" />
                </label>
                <label>
                  Format
                  <select name="format">
                    <option value="webp">webp</option>
                    <option value="png">png</option>
                    <option value="jpeg">jpeg</option>
                  </select>
                </label>
                <label>
                  Quality
                  <input type="number" name="quality" min="1" max="100" defaultValue="80" />
                </label>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Converting…" : "Convert Image"}
              </button>
            </form>
            {imageResult?.url && (
              <div className="preview">
                <img src={imageResult.url} alt="Converted preview" />
                <button
                  onClick={() => downloadBlob(imageResult.blob, `converted.${imageResult.format}`)}
                >
                  Download Converted Image
                </button>
              </div>
            )}
          </section>
        );
      case "video":
        return (
          <section className="section">
            <h2>Convert a video to mp4, webm, mkv, or avi</h2>
            <form onSubmit={handleConvertVideo}>
              <FileDrop name="file" accept="video/*" placeholder="Drag & drop a video here or click to browse" />
              <label>
                Target format
                <select name="format">
                  <option value="mp4">mp4</option>
                  <option value="webm">webm</option>
                  <option value="mkv">mkv</option>
                  <option value="avi">avi</option>
                </select>
              </label>
              <button type="submit" disabled={loading}>
                {loading ? "Processing…" : "Convert Video"}
              </button>
            </form>
          </section>
        );
      case "pdf":
        return (
          <section className="section">
            <h2>Upload images and generate a PDF</h2>
            <form onSubmit={handleCreatePdf}>
              <FileDrop name="images" accept="image/*" multiple placeholder="Drag & drop images here or click to browse (multiple files allowed)" />
              <button type="submit" disabled={loading}>
                {loading ? "Generating…" : "Create PDF"}
              </button>
            </form>
          </section>
        );
      case "health":
        return (
          <section className="section">
            <h2>Check backend health status</h2>
            <button
              onClick={async () => {
                setLoading(true);
                setStatus("Checking health...");
                try {
                  const response = await fetch(`${API_BASE}/health`);
                  if (response.ok) {
                    const data = await response.json();
                    setStatus(`✅ Backend is healthy: ${JSON.stringify(data)}`);
                  } else {
                    setStatus("⚠️ Backend is not responding.");
                  }
                } catch (error) {
                  setStatus(`⚠️ Error: ${error.message}`);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {loading ? "Checking…" : "Check Health"}
            </button>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <header>
        <div>
          <span className="badge">BinaryShield</span>
          <h1>Frontend Control Panel</h1>
          <p>Connect to the backend API to validate files, convert images/videos, and export PDFs.</p>
        </div>
      </header>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab(tab.id);
              resetState();
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <main>
        {renderTabContent()}
        <div className="feedback">
          <p className={status.startsWith("✅") ? "status success" : status.startsWith("⚠️") ? "status error" : "status"}>
            {status || "Select a task above and submit a file."}
          </p>
          {loading && progress > 0 && <ProgressBar progress={progress} />}
        </div>
      </main>
    </div>
  );
}

export default App;
