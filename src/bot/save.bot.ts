import { exec } from 'child_process';
import * as path from 'path';

export const downloadFromYoutube = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      '..',
      '..',
      'python',
      'download.py',
    );

    exec(`python3 ${scriptPath} ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Xatolik:', stderr);
        return reject('Video yuklab bo‘lmadi');
      }
      const videoPath = path.join(
        __dirname,
        '..',
        '..',
        'downloads',
        'video.mp4',
      );
      resolve(videoPath);
    });
  });
};
