/**
 * Client-side image compressor utility
 * Resizes large smartphone/camera photos (often 3MB~10MB) to optimized web dimensions (max 900x675)
 * and compresses them to JPEG (quality ~0.82) resulting in ~50-90KB data URLs.
 * This ensures localStorage never hits quota errors even after saving multiple menu photos!
 */
export interface CompressResult {
  dataUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
}

export const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.78
): Promise<CompressResult> => {
  return new Promise((resolve, reject) => {
    const originalSizeKB = Math.round(file.size / 1024);

    // If already small SVG or small WebP, read directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          originalSizeKB,
          compressedSizeKB: originalSizeKB,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();

      img.onerror = () => {
        // Fallback to raw data url if image decode fails
        resolve({
          dataUrl: rawDataUrl,
          originalSizeKB,
          compressedSizeKB: originalSizeKB,
        });
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate scaling ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            originalSizeKB,
            compressedSizeKB: originalSizeKB,
          });
          return;
        }

        // Fill background white to support transparent PNGs when exported to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Output JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const compressedSizeKB = Math.round(
          (compressedDataUrl.length * 3) / 4 / 1024
        );

        resolve({
          dataUrl: compressedDataUrl,
          originalSizeKB,
          compressedSizeKB,
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
};
