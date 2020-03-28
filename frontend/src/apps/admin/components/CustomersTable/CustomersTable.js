import React from 'react';
import PropTypes from 'prop-types';
import noop from 'no-op';
import { domainify } from 'sf/helpers';
import BaseComponent from 'components/BaseComponent';
import Pagination from 'sf/components/Pagination';
import NegativeListIcon from 'apps/admin/components/NegativeListIcon';
import { pinAdapter, authTypeAdapter } from 'apps/admin/models/admin';
import Button from 'sf/components/Button';
import Select from 'sf/components/Select';
import ValidationInput from 'sf/components/ValidationInput';
import ButtonOptions from 'components/ButtonOptions';

const statusClasses = {
  success: 'success',
  fail: 'error',
  incomplete: 'unknown',
};

export default class CustomersTable extends BaseComponent {
  className = 'ts-CustomersTable';

  static propTypes = {
    activePage: PropTypes.number,
    isBlacklistMode: PropTypes.bool,
    onItemSelect: PropTypes.func,
    onPaginationPageSelect: PropTypes.func,
    onResultFilterChange: PropTypes.func,
    onSearchFilterButtonClick: PropTypes.func,
    pagesCount: PropTypes.number,
    customers: PropTypes.arrayOf(
      PropTypes.shape({
        credit_card: PropTypes.string,
        device_browser_fingerprint: PropTypes.string,
        device_browser_fingerprint_user_media: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        phone: PropTypes.string,
        pin: PropTypes.string,
        registered_time: PropTypes.string,
      })
    ),
    showFilters: PropTypes.bool,
  };

  static defaultProps = {
    activePage: 1,
    isBlacklistMode: false,
    onItemSelect: noop,
    onPaginationPageSelect: noop,
    onResultFilterChange: noop,
    onSearchFilterButtonClick: noop,
    pagesCount: 1,
    showFilters: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      filterAuthenticationResult: props.isBlacklistMode ? 'blacklisted' : null,
      filterAuthenticationSearch: null,
    };
  }

  handleSearchKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.handleSearchFilterButtonClick();
    }
    e.preventDefault();
  }

  handleResultFilterChange = () => {
    this.props.onResultFilterChange(this.state);
  }

  handleSearchFilterButtonClick = () => {
    this.props.onSearchFilterButtonClick(this.state);
  }

  handlePaginationPageSelect = (selectedPage) => {
    this.props.onPaginationPageSelect(selectedPage);
  }

  handleItemClick = (id) => {
    this.props.onItemSelect({
      id
    });
  }

  getHeaderRow = () => {
    return (
      <tr className={ this.cn`__cell` } key="th">
        { [
          'Status',
          'Authentication',
          'Pin',
          'Reason',
          'Credit card',
          'SSN',
          'First name',
          'Last name',
          'Fingerprint',
          'Contact method',
          'Registered'
        ].map((el) => (
          <th
            className={ this.cn`__header-cell __header-cell--${domainify(el)}` }
            key={ el }
          >
            { el }
          </th>)
        ) }
      </tr>
    );
  }

  getFingerprint = ({
    device_browser_fingerprint, // eslint-disable-line react/prop-types
    device_browser_fingerprint_user_media, // eslint-disable-line react/prop-types
  }) => {
    if (!device_browser_fingerprint && !device_browser_fingerprint_user_media) return null;
    const hashes = `${device_browser_fingerprint} | ${device_browser_fingerprint_user_media}`;

    return <span title={ hashes }>{ hashes }</span>;

    //   const BrowserStamp = global.BrowserStamp.default;
    //    const hashes = `${BrowserStamp.toHumanReadable(device_browser_fingerprint)}
    // | ${BrowserStamp.toHumanReadable(device_browser_fingerprint_user_media)}`;
    //
    // class HashContainer extends BaseComponent {
    //   componentDidMount() {
    //     findDOMNode(this).innerHTML = BrowserStamp.toImage(device_browser_fingerprint, 13)
    //       + BrowserStamp.toImage(device_browser_fingerprint_user_media, 13);
    //   }

    //   render() {
    //     return <span></span>;
    //   }
    // }

    // return <HashContainer />;
  }

  getItemsRow = (customer) => {
    const authenticationResult = customer.authentication_status;
    const createdDate = new Date(customer.created).toString().split(' ');
    const createdDateFmt =
      `${createdDate[2]} ${createdDate[1]} ${createdDate[3]} ${createdDate[4].slice(0, -3)}`;
    const contactFmt = (customer.contact_address &&
      <a
        href={ `${customer.contact_method === 'sms'
          ? 'tel:'
          : 'mailto:'
        }${customer.contact_address}` }
        onClick={ (e) => e.stopPropagation() }
      >
        { customer.contact_address }
      </a>
    );
    const adaptedPin = pinAdapter(customer.pin);
    const PIN_CELL_INDEX = 2; // different styling for pin cell
    return (
      <tr
        className={ this.cn`__row` }
        key={ customer.pk }
        onClick={ () => {
          this.handleItemClick(customer.pk);
        } }
      >
        { [
          <span
            className={ this.cn`__label __label--${
              statusClasses[customer.lock === 'locked' ? 'fail' : 'success']
            }` }
          >
            { customer.lock }
          </span>,
          <span
            className={ this.cn({
              '__label': true,
              '__label--blacklist': customer.found_in_blacklist,
              [`__label--${statusClasses[authenticationResult]}`]: true,
            }) }
          >
            { customer.found_in_blacklist
              ? 'negative list'
              : authenticationResult
            }
            { customer.blacklisted && <NegativeListIcon /> }
          </span>,
          adaptedPin,
          authTypeAdapter(customer.authentication_type),
          customer.short_account_number,
          customer.ssn,
          customer.first_name,
          customer.last_name,
          this.getFingerprint(customer),
          contactFmt,
          createdDateFmt,
        ].map((el, index) => (
          <td
            className={ this.cn({
              '__cell': true,
              '__cell--nowrap': index === PIN_CELL_INDEX,
              '__cell--muted': index === PIN_CELL_INDEX &&
                ['PIN_EXPIRED', 'PIN_NOT_GENERATED'].includes(customer.pin),
              // different styling cells from right to pin
              '__cell--wrapped': index > PIN_CELL_INDEX + 1,
            }) }
            /* eslint-disable react/no-array-index-key */
            key={ `${customer.pk}${index}` }
            /* eslint-enable react/no-array-index-key */
          >
            { el }
          </td>)
        ) }
      </tr>
    );
  }

  renderFiltersAndSearch() {
    let filters = null;
    if (this.props.isBlacklistMode) {
      filters = (
        <ButtonOptions
          header={ null }
          options={ [
            { value: 'blacklisted', label: 'Added to negative list' },
            { value: 'found_in_blacklist', label: 'Matched to negative list' }
          ] }
          value={ this.state.filterAuthenticationResult }
          onChange={ (filterAuthenticationResult) => {
            this.setState({ filterAuthenticationResult }, this.handleResultFilterChange);
          } }
        />
      );
    } else if (this.props.showFilters) {
      filters = (
        <Select
          displayName="Show"
          options={ [
            {
              value: '',
              label: 'All Authentication results '
            },
            {
              value: 'positive',
              label: 'Positive results'
            },
            {
              value: 'negative',
              label: 'Negative results'
            },
            {
              value: 'locked',
              label: 'Locked'
            },
            {
              value: 'unlocked',
              label: 'Unlocked'
            },
          ] }
          stateLink={ [this, 'filterAuthenticationResult'] }
          placeholderAlwaysVisible={ false }
          onChange={ this.handleResultFilterChange }
        />
      );
    }

    return (
      <div className={ this.cn`__filters` }>
        { filters }
        <div className={ this.cn`__search-filter-container` }>
          <ValidationInput
            displayName="Search"
            stateLink={ [this, 'filterAuthenticationSearch'] }
            onKeyUp={ this.handleSearchKeyUp }
          />
          <Button
            onClick={ this.handleSearchFilterButtonClick }
            outlined={ true }
            theme="accent"
          >
            Go
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { items: customers } = this.props;
    return (
      <div className={ this.rootcn() }>
        { this.renderFiltersAndSearch() }
        <table className={ this.cn`__table` }>
          <thead className={ this.cn`__header` }>
            { this.getHeaderRow() }
          </thead>
          <tbody>
            { customers
              ? customers.map(this.getItemsRow)
              : <tr><td className={ this.cn`__empty-cell` } colSpan={ 7 }>No items to show</td></tr>
            }
          </tbody>
        </table>
        <div className={ this.cn`__paginaton` }>
          <Pagination
            activePage={ this.props.activePage }
            pagesCount={ this.props.pagesCount }
            onPageSelect={ this.handlePaginationPageSelect }
            showPrevAndNext={ true }
            aggregateNumber={ 3 }
          />
        </div>
      </div>
    );
  }
}
