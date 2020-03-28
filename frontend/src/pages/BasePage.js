import BaseComponent from 'components/BaseComponent';
import is from 'next-is';
import { scrollTo } from 'sf/helpers/domHelper';

export default class BasePage extends BaseComponent {
  /**
   * getComponentData is used for server side rendering.
   * It can set data to models before constructor is called.
   *
   * @param  {object} props  Props from router.
   * @return {object[Promise]}
   */
  getComponentData() {
    return Promise.resolve();
  }

  constructorBrowser() {
    this.setTimeout(() => {
      if (this.title) {
        this.publish('titleUpdate', this.title);
      }
    }, 100);
  }

  constructor(props) {
    super(props);
    setTimeout(() => {
      // this.title is available AFTER constructor
      if (is.browser()) {
        if (!document.location.hash) {
          scrollTo(0);
        }
        document.title = this.title
          ? `${this.title} - ${DEFAULT_PAGE_TITLE}`
          : DEFAULT_PAGE_TITLE;
      }
    });
  }
}
