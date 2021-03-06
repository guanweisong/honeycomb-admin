import React from 'react'
import classNames from 'classnames'
import styles from './index.less'

const Loader = () => {
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

export default Loader
