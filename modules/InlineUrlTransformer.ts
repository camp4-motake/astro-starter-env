import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Url } from 'lightningcss';

interface InlineOptions {
  basePath?: string;
  maxSize?: number; // by the byte
}

/**
 * Lightningcss InlineUrlTransformer
 */
export class InlineUrlTransformer {
  private basePath: string;
  private maxSize: number;

  constructor(options: InlineOptions = {}) {
    this.basePath = options.basePath || './src';
    this.maxSize = options.maxSize || Infinity;
  }

  visitor() {
    return {
      Url: (url: Url) => {
        const originalUrl = url.url;

        if (!originalUrl.includes('?inline')) {
          return url;
        }

        try {
          const filePath = originalUrl.split('?')[0];
          const absolutePath = resolve(this.basePath, filePath);
          const buffer = readFileSync(absolutePath);

          if (buffer.length > this.maxSize) {
            console.warn(
              `File ${filePath} (${buffer.length} bytes) exceeds maxSize (${this.maxSize} bytes). Skipping inline.`,
            );
            return url;
          }

          const ext = filePath.split('.').pop()?.toLowerCase() || '';
          const mime = this.getMimeType(filePath);

          if (ext === 'svg') {
            const svgContent = buffer.toString('utf-8');
            const encoded = encodeURIComponent(svgContent)
              .replace(/'/g, '%27')
              .replace(/"/g, '%22');

            return {
              ...url,
              url: `data:${mime};charset=UTF-8,${encoded}`,
            };
          }

          const base64 = buffer.toString('base64');
          return {
            ...url,
            url: `data:${mime};base64,${base64}`,
          };
        } catch (err) {
          const error = err as Error;
          console.error(`Failed to inline ${originalUrl}:`, error.message);
          return url;
        }
      },
    };
  }

  private getMimeType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase() || '';

    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      webp: 'image/webp',
      avif: 'image/avif',
      woff: 'font/woff',
      woff2: 'font/woff2',
      ttf: 'font/ttf',
      otf: 'font/otf',
      eot: 'application/vnd.ms-fontobject',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}
