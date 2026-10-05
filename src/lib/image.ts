/**
 * Turns a chosen picture into a small 4:5 JPEG (480x600, centre-cropped) suitable for a membership card.
 * Rejects when the file is not a readable image.
 */
export function fileToCardPhoto(file: File, width = 480, height = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('not_image'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('no_canvas'));
      // "cover": scale so the picture fills the frame, then centre-crop
      const scale = Math.max(width / img.width, height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('not_image'));
    };
    img.src = url;
  });
}
