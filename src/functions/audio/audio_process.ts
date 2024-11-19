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

export async function blobToPCM(audioBlob: Blob) {
  const audioContext = new AudioContext();
  return audioBlob.arrayBuffer()
    .then(buffer => audioContext.decodeAudioData(buffer))
    .then(audioBuffer => {
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const pcmData = [];

      for (let i = 0; i < numberOfChannels; i++) {
        pcmData.push(audioBuffer.getChannelData(i));
      }

      return { pcmData, sampleRate, numberOfChannels };
    });
}

export function encodeWAV(pcmData: Float32Array[], sampleRate: number, numberOfChannels: number) {
  const bufferLength = pcmData[0].length * numberOfChannels * 2 + 44;
  const wavBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(wavBuffer);

  // Header RIFF
  writeString(view, 0, 'RIFF');
  view.setUint32(4, bufferLength - 8, true);
  writeString(view, 8, 'WAVE');

  // Subchunk 1 - fmt
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, numberOfChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numberOfChannels * 2, true); // ByteRate
  view.setUint16(32, numberOfChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // Subchunk 2 - data
  writeString(view, 36, 'data');
  view.setUint32(40, bufferLength - 44, true);

  // PCM data
  let offset = 44;
  for (let i = 0; i < pcmData[0].length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, pcmData[channel][i])); // Clamp
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: any, offset: any, string: any) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export const convertTo16kHz = async (audioBlob: any, audioContext: any) => {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const offlineAudioContext = new OfflineAudioContext(
    1,
    (audioBuffer.duration * 16000) | 0,
    16000
  );

  const source = offlineAudioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineAudioContext.destination);
  source.start();

  const renderedBuffer = await offlineAudioContext.startRendering();
  return audioBufferToBlob(renderedBuffer);
};

const audioBufferToBlob = (buffer:any) => {
  const wavArray = new Float32Array(buffer.length);
  buffer.copyFromChannel(wavArray, 0, 0);

  const wav = new DataView(new ArrayBuffer(buffer.length * 2));
  for (let i = 0; i < wavArray.length; i++) {
    wav.setInt16(i * 2, wavArray[i] * 0x7fff, true);
  }

  return new Blob([wav], { type: "audio/wav" });
};
