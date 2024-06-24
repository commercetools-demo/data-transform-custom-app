import Spacings from '@commercetools-uikit/spacings';
import PreviewItem from './preview-item';

type Props = {
  files: File[];
};

const Preview = ({ files }: Props) => {
  return (
    <Spacings.Stack>
      {files.map((file) => (
        <PreviewItem key={file.name} file={file} />
      ))}
    </Spacings.Stack>
  );
};

export default Preview;
