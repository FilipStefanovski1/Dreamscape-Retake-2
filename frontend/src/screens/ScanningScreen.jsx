import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSyncAlt } from "react-icons/fa";

const ScanningScreen = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [facingMode, setFacingMode] = useState("environment");
  const [isFlipping, setIsFlipping] = useState(false);

  const MODEL_PATH = "/tm-model/";
  const HF_TOKEN = "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"

  const stableLabelRef = useRef(null);
  const stableStartTimeRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  // More robust normalization for labels
  const normalizeLabel = (label) => {
    const lower = label.toLowerCase();

    if (lower.includes("chair") || lower.includes("armchair") || lower.includes("stool") || lower.includes("sofa"))
      return "chair";
    if (lower.includes("pillow") || lower.includes("cushion"))
      return "pillow";
    if (lower.includes("bed") || lower.includes("mattress") || lower.includes("bunk"))
      return "bed";
    if (lower.includes("table") || lower.includes("desk") || lower.includes("worktop") || lower.includes("workspace"))
      return "table";

    return lower; // fallback
  };

  useEffect(() => {
    const initModel = async () => {
      const modelURL = MODEL_PATH + "model.json";
      const metadataURL = MODEL_PATH + "metadata.json";

      const loadedModel = await tmImage.load(modelURL, metadataURL);
      if (webcam) webcam.stop();

      const newWebcam = new tmImage.Webcam(320, 240, facingMode === "user");
      await newWebcam.setup({ facingMode });
      await newWebcam.play();

      setModel(loadedModel);
      setWebcam(newWebcam);

      if (videoRef.current) {
        videoRef.current.innerHTML = "";
        videoRef.current.appendChild(newWebcam.canvas);
        newWebcam.canvas.style.width = "100%";
        newWebcam.canvas.style.height = "100%";
        newWebcam.canvas.style.objectFit = "cover";
        newWebcam.canvas.style.borderRadius = "16px";
      }

      requestAnimationFrame(() => loop(newWebcam, loadedModel));
    };

    initModel();
  }, [facingMode]);

  const loop = async (webcamInstance, modelInstance) => {
    webcamInstance.update();
    await predict(webcamInstance, modelInstance);
    requestAnimationFrame(() => loop(webcamInstance, modelInstance));
  };

  const predict = async (webcamInstance, modelInstance) => {
    const predictionList = await modelInstance.predict(webcamInstance.canvas);
    setPredictions(predictionList);

    const validProductLabels = ["Chair", "Table", "Pillow", "Bed", "Desk"];
    const confidentPredictions = predictionList
      .filter(
        (p) =>
          validProductLabels.includes(p.className) && p.probability > 0.9
      )
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 1);

    if (confidentPredictions.length > 0) {
      const topLabel = confidentPredictions[0].className;
      const now = Date.now();

      if (stableLabelRef.current === topLabel) {
        if (
          now - stableStartTimeRef.current > 2000 &&
          !hasNavigatedRef.current
        ) {
          hasNavigatedRef.current = true;
          navigate("/recommendations", {
            state: { label: normalizeLabel(topLabel) },
          });
        }
      } else {
        stableLabelRef.current = topLabel;
        stableStartTimeRef.current = now;
      }
    } else {
      stableLabelRef.current = null;
      stableStartTimeRef.current = null;
    }
  };

  const flipCamera = () => {
    setIsFlipping(true);
    setFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
    setTimeout(() => setIsFlipping(false), 400);
  };

  const convertToJpeg = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.95
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const captureAndSend = async () => {
    if (!webcam) return;
    const dataUrl = webcam.canvas.toDataURL("image/jpeg");
    const blob = await (await fetch(dataUrl)).blob();

    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "image/jpeg",
          },
          body: blob,
        }
      );

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(JSON.stringify(data));

      const sorted = data.sort((a, b) => b.score - a.score);
      const topLabel =
        sorted[0]?.label || sorted[0]?.className || "unknown";
      navigate("/recommendations", {
        state: { label: normalizeLabel(topLabel) },
      });
    } catch (err) {
      console.error("Hugging Face error:", err);
      alert("Image recognition failed.");
    }
  };

  const handleImageUpload = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    if (file.type === "image/avif" || file.type === "image/heic") {
      file = await convertToJpeg(file);
    }

    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "image/jpeg",
          },
          body: file,
        }
      );

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(JSON.stringify(data));

      const sorted = data.sort((a, b) => b.score - a.score);
      const topLabel =
        sorted[0]?.label || sorted[0]?.className || "unknown";
      navigate("/recommendations", {
        state: { label: normalizeLabel(topLabel) },
      });
    } catch (err) {
      console.error("Hugging Face error:", err);
      alert("Image recognition failed.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.scanFrame}>
        <div ref={videoRef} style={styles.video} />
        {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((corner) => (
          <div
            key={corner}
            style={{
              ...styles.corner,
              ...styles[corner],
              animation: "pulse 1.2s infinite",
            }}
          />
        ))}
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.text}>Scanning for items...</div>

        <div style={styles.predictions}>
          {predictions
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 3)
            .map((p) => (
              <div key={p.className}>
                {p.className}: {(p.probability * 100).toFixed(1)}%
              </div>
            ))}
        </div>

        <div style={styles.buttonRow}>
          <label style={styles.iconButton}>
            <FaCamera size={20} color="#000" />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>

          <button style={styles.bigCircle} onClick={captureAndSend}></button>

          <button
            style={{
              ...styles.iconButton,
              transform: isFlipping ? "rotate(360deg)" : "rotate(0deg)",
              transition: "transform 0.4s ease",
            }}
            onClick={flipCamera}
          >
            <FaSyncAlt size={20} color="#000" />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100%",
    backgroundColor: "#000",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1,
  },
  scanFrame: {
    position: "absolute",
    top: "8%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80vw",
    maxWidth: 320,
    height: "60vh",
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 2,
  },
  video: { width: "100%", height: "100%", zIndex: 2 },
  corner: { width: 30, height: 30, position: "absolute", borderColor: "white", zIndex: 3 },
  topLeft: { top: 0, left: 0, borderTop: "4px solid white", borderLeft: "4px solid white" },
  topRight: { top: 0, right: 0, borderTop: "4px solid white", borderRight: "4px solid white" },
  bottomLeft: { bottom: 0, left: 0, borderBottom: "4px solid white", borderLeft: "4px solid white" },
  bottomRight: { bottom: 0, right: 0, borderBottom: "4px solid white", borderRight: "4px solid white" },
  bottomSection: { position: "absolute", bottom: 90, width: "100%", textAlign: "center", zIndex: 4, color: "white" },
  text: { fontSize: 18, fontWeight: "600" },
  predictions: { marginTop: 10, fontSize: 16 },
  buttonRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 16 },
  bigCircle: { backgroundColor: "white", borderRadius: "50%", width: 80, height: 80, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
  iconButton: { backgroundColor: "white", borderRadius: "50%", padding: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}`;
document.head.appendChild(styleTag);

export default ScanningScreen;
