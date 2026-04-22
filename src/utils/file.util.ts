export const truncateFileName = (fileName: string, maxLength: number) => {
  if (!fileName) return '';
  if (fileName.length <= maxLength) return fileName;
  const ext = fileName.split('.').pop();

  const remainingLength = maxLength - 3;

  return `${fileName.substring(0, Math.ceil(remainingLength / 2))}...${fileName.substring(
    fileName.length - Math.floor(remainingLength / 2) - (ext?.length ?? 0),
  )}`;
};
