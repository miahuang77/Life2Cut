import { useRef, useState } from 'react';

const STICKER_OPTIONS = ['🎉', '❤️', '⭐', '🔥', '😎', '🌈', '🎀', '👑'];

const PhotoPreview = ({ photo, setPhoto }) => {
  const containerRef = useRef(null);
  const [stickers, setStickers] = useState([]);
  const [dragging, setDragging] = useState(null);

  const addSticker = (emoji) => {
    setStickers([...stickers, { id: Date.now(), emoji, x: 50, y: 50 }]);
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

      stickers.forEach(s => {
        ctx.font = '40px serif';
        ctx.fillText(s.emoji, s.x, s.y + 40);
      });

      const link = document.createElement('a');
      link.download = 'photobooth.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
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
        {STICKER_OPTIONS.map((emoji) => (
          <button key={emoji} onClick={() => addSticker(emoji)}>
            {emoji}
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
          <span
            key={s.id}
            onPointerDown={(e) => handlePointerDown(e, s.id)}
            onDoubleClick={() => removeSticker(s.id)}
            className="preview-sticker"
            style={{ left: s.x, top: s.y }}
          >
            {s.emoji}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="preview-actions">
        <button onClick={handleDownload}>Download</button>
        <button onClick={() => setPhoto(null)}>Retake</button>
      </div>
    </div>
  );
};

export default PhotoPreview;
