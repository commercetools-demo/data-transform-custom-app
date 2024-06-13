import Constraints from '@commercetools-uikit/constraints';
import Processes from '../process';
import { PageContentFull } from '@commercetools-frontend/application-components';

const Welcome = () => {
  return (
    <PageContentFull>
      <Processes />
    </PageContentFull>
  );
};
Welcome.displayName = 'Welcome';

export default Welcome;
