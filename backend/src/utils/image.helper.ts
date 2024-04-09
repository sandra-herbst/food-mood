import * as fs from 'fs';

/**
 * Delete an image by their path.
 * @param path of the image. e.g "public/img/users/[UUID]"
 */
export async function deleteImage(path: string): Promise<void> {
  await fs.unlink(path, (err) => {
    if (err) {
      return err;
    }
  });
}

export function buildImagePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}
