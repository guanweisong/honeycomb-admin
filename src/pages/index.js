import React, { PureComponent } from 'react';
import Redirect from 'umi/redirect';

class Index extends PureComponent {
  render() {
    return <Redirect to='/dashboard' />
  }
}

export default Index;
