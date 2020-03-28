import React from 'react';
import _get from 'lodash/get';
import pick from 'lodash/pick';
import PropTypes from 'prop-types';
import Table from 'react-table';
import BaseComponent from 'components/BaseComponent';
import { FILTER_KEYS } from 'constants';
import { asset, loadCssFile } from 'sf/helpers';
import filters from 'models/filters';

const DEFAULT_PAGE_SIZE = 20;

export default class MightyDataTable extends BaseComponent {
  className = 'ts-MightyDataTable';

  state = {
    page_number: 0,
    page_size: DEFAULT_PAGE_SIZE,
  };

  static propTypes = {
    children: PropTypes.node,
    columns: PropTypes.arrayOf(PropTypes.shape(
      {
        accessor: PropTypes.string.isRequired,
        Header: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.object,
        ]).isRequired,
      }
    )),
    dataPropName: PropTypes.string.isRequired,
    fetchMethodName: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    limit: PropTypes.number,
    sortable: PropTypes.bool,
  };

  static defaultProps = {
    children: '',
    columns: [],
    sortable: false,
  };

  componentDidMount() {
    filters.clearFilters();
    loadCssFile(asset`lib/react-table/react-table.css`);
    this.syncStateWithModel(this.props.model, [
      this.props.dataPropName,
      'page_count',
      'page_number',
    ]);
    this.syncStateWithModel(filters, FILTER_KEYS);
  }

  handleFetchData = (config) => {
    const sorted = _get(config, 'sorted') || [];
    const { fetchMethodName, limit, model } = this.props;
    const [sortSpec] = [...sorted, {}];
    filters.set({
      ...sortSpec.id ? {
        order_by: sortSpec.id,
        order: sortSpec.desc ? 'desc' : 'asc',
      } : {},
    });
    this.setState(
      { loading: true },
      () => {
        model[fetchMethodName]({
          ...pick(this.state, FILTER_KEYS),
          page_size: limit || this.state.page_size,
          page_number: limit ? 1 : this.state.page_number + 1,
        })
          .then(() => this.setState({
            loading: false,
          }));
      }
    );
  };

  handlePageChange = (page_number) => this.props.model
    .set({ page_number })
    .then(() => this.handleFetchData());

  refreshData = () => this.props.model.set({
    page_number: 0,
  }).then(this.handleFetchData);

  render() {
    const { dataPropName } = this.props;
    return (
      <div
        className={ this.rootcn() }
      >
        <Table
          columns={ this.props.columns }
          data={ this.state[dataPropName] }
          defaultPageSize={ this.props.limit || DEFAULT_PAGE_SIZE }
          loading={ this.state.loading }
          minRows={ 1 }
          manual={ true }
          page={ this.state.page_number }
          pages={ this.props.limit ? 1 : this.state.page_count }
          resizable={ false }
          showPageJump={ false }
          showPageSizeOptions={ false }
          showPagination={ !this.props.limit && this.state.page_count > 1 }
          sortable={ this.props.sortable }
          onFetchData={ this.handleFetchData }
          onPageChange={ this.handlePageChange }
        />
      </div>
    );
  }
}
