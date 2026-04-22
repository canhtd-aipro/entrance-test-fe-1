export const getAudioDuration = (file: File) => {
  return new Promise<number>((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      resolve(audio.duration); // in seconds
      URL.revokeObjectURL(audio.src);
    };

    audio.onerror = (err) => reject(err);

    audio.src = URL.createObjectURL(file);
  });
};
