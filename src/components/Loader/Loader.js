import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './Loader.less';

export default class Loader extends PureComponent {
  render () {
    return (
      <div
        className={classNames(styles.loader, {
          [styles.fullScreen]: true,
        })}
      >
        <div className={styles.warpper}>
          <div className={styles.inner} />
          <div className={styles.text}>LOADING</div>
        </div>
      </div>
    )
  }
}
