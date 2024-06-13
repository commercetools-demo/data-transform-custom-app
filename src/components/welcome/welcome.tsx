import Constraints from '@commercetools-uikit/constraints';
import Processes from '../process';

const Welcome = () => {
  return (
    <Constraints.Horizontal max="scale">
      <Processes />
    </Constraints.Horizontal>
  );
};
Welcome.displayName = 'Welcome';

export default Welcome;
