import { error, type RequestHandler } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export const GET: RequestHandler = async ({ params }) => {
  const { filename } = params;

  if (!filename || filename.includes('..') || filename.includes('/')) {
    throw error(400, 'Invalid filename');
  }

  const filepath = path.resolve('static/uploads', filename);

  if (!existsSync(filepath)) {
    throw error(404, 'File not found');
  }

  try {
    const file = await readFile(filepath);
    const ext = path.extname(filename).toLowerCase();

    // Determine content type based on file extension
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (err) {
    throw error(500, 'Error reading file');
  }
}
