import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { getWrapper } from 'sf/helpers/test';
import DataSourceSelector from 'components/DataSourceSelector';

const setupWrapper = (config = {}) => {
  const { method = shallow, props = {} } = config;
  return getWrapper({
    Component: DataSourceSelector,
    method,
    props: {
      ...props,
    },
  });
};

let wrapper;

beforeEach(() => {
  wrapper = setupWrapper();
});

afterEach(() => {
  expect(toJSON(wrapper.render())).toMatchSnapshot();
});

describe('DataSourceSelector', () => {
  it('test suite should be updated after implementing the component', () => {
    expect(true).toBe(false);
  });

  it('should render', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
