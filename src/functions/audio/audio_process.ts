import { parseBuffer } from 'music-metadata';
/**
 * Lấy thời lượng của tệp âm thanh từ Buffer.
 * @param buffer Dữ liệu Buffer của tệp âm thanh.
 * @returns Thời lượng của tệp âm thanh (đơn vị giây) hoặc undefined nếu không thể lấy.
 */
export async function getAudioDurationFromBuffer(buffer: Uint8Array): Promise<number | undefined> {
    try {
      const metadata = await parseBuffer(buffer, 'audio/wav'); // Định dạng MIME có thể thay đổi tùy loại tệp (mp3, wav, ...)
      return metadata.format.duration; // Thời lượng tính bằng giây
    } catch (error) {
      console.error("Lỗi:", error);
      return undefined;
    }
  }