import { useRef, useState } from 'react';
import stickerOne from '../assets/sticker1.png';
import stickerTwo from '../assets/sticker2.png';
import stickerThree from '../assets/sticker3.png';
import stickerFour from '../assets/sticker4.png';
import stickerFive from '../assets/sticker5.png';

const STICKER_OPTIONS = [
  { src: stickerOne, size: 60 },
  { src: stickerTwo, size: 60 },
  { src: stickerThree, size: 50 },
  { src: stickerFour, size: 60 },
  { src: stickerFive, size: 60 },
];

const PhotoPreview = ({ photo, setPhoto }) => {
  const containerRef = useRef(null);
  const [stickers, setStickers] = useState([]);
  const [dragging, setDragging] = useState(null);

  const addSticker = (src, size) => {
    setStickers([...stickers, { id: Date.now(), src, size, x: 50, y: 50 }]);
  };

  const handlePointerDown = (e, id) => {
    e.preventDefault();
    const container = containerRef.current.getBoundingClientRect();
    setDragging({
      id,
      offsetX: e.clientX - container.left - stickers.find(s => s.id === id).x,
      offsetY: e.clientY - container.top - stickers.find(s => s.id === id).y,
    });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const container = containerRef.current.getBoundingClientRect();
    const x = e.clientX - container.left - dragging.offsetX;
    const y = e.clientY - container.top - dragging.offsetY;
    setStickers(stickers.map(s =>
      s.id === dragging.id ? { ...s, x, y } : s
    ));
  };

  const handlePointerUp = () => {
    setDragging(null);
  };

  const handleDownload = () => {
    const container = containerRef.current;
    const canvas = document.createElement('canvas');
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let loaded = 0;
      if (stickers.length === 0) {
        const link = document.createElement('a');
        link.download = 'photobooth.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        return;
      }
      stickers.forEach(s => {
        const sImg = new Image();
        sImg.onload = () => {
          const scale = s.size / sImg.naturalWidth;
          ctx.drawImage(sImg, s.x, s.y, s.size, sImg.naturalHeight * scale);
          loaded++;
          if (loaded === stickers.length) {
            const link = document.createElement('a');
            link.download = 'photobooth.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        };
        sImg.src = s.src;
      });
    };
    img.src = photo;
  };

  const removeSticker = (id) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  return (
    <div>
      {/* Sticker palette */}
      <div className="preview-sticker-bar">
        {STICKER_OPTIONS.map((opt, i) => (
          <button key={i} onClick={() => addSticker(opt.src, opt.size)}>
            <img src={opt.src} alt={`sticker ${i + 1}`} style={{ width: 32, height: 32 }} />
          </button>
        ))}
      </div>

      {/* Photo with draggable stickers */}
      <div
        ref={containerRef}
        className="preview-container"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <img src={photo} alt="Captured" className="preview-image" />

        {stickers.map((s) => (
          <img
            key={s.id}
            src={s.src}
            alt="sticker"
            onPointerDown={(e) => handlePointerDown(e, s.id)}
            onDoubleClick={() => removeSticker(s.id)}
            className="preview-sticker"
            style={{ left: s.x, top: s.y, width: s.size, height: 'auto' }}
            draggable={false}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="preview-actions">
        <button className='download-button' onClick={handleDownload}>Download</button>
        <button className='retake-button'onClick={() => setPhoto(null)}>Retake</button>
      </div>
    </div>
  );
};

export default PhotoPreview;
