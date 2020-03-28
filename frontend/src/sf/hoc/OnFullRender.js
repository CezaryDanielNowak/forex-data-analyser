import React from 'react';
import { onFullRender } from 'sf/helpers/domHelper';

export default function withFullRender(ComposedComponent) {
  return class Tooltip extends React.Component {
    state = {};

    componentDidMount() {
      onFullRender()
        .then(() => this.setState({ fullyRendered: true }));
    }

    render() {
      if (!this.state.fullyRendered) return null;

      return (
        <ComposedComponent { ...this.props } />
      );
    }
  };
}
