import { FC, useRef, useState } from 'react';
import { helperRequest } from '../../../requests/helper.request';
import { ReadIdCardResponse } from '../../../types/requests/helper.type';
import { UploadInput, UploadInputProps } from '../upload-input/UploadInput';
import './styles.scss';

const fileTypes = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'bmp'];

type IdCardInputProps = {
  onInfo: (data: ReadIdCardResponse) => void;
};

export const IdCardInput: FC<IdCardInputProps> = ({ onInfo }) => {
  const [loading, setLoading] = useState(false);

  const onInfoRef = useRef(onInfo);

  const onFile: UploadInputProps['onFile'] = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const info = await helperRequest.readIdCard(formData);
      onInfoRef.current?.(info);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploadInput
      value={undefined}
      showUploadList={false}
      onFile={onFile}
      customRequest={() => {}}
      fileTypes={fileTypes}
      maxFileSize={1024}
      loading={loading}
    />
  );
};
