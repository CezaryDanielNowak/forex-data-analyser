import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { getWrapper } from 'sf/helpers/test';
import RatioCompareChart from 'components/RatioCompareChart';

const setupWrapper = (config = {}) => {
  const { method = shallow, props = {} } = config;
  return getWrapper({
    Component: RatioCompareChart,
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

describe('RatioCompareChart', () => {
  it('test suite should be updated after implementing the component', () => {
    expect(true).toBe(false);
  });

  it('should render', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
