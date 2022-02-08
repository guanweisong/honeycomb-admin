import React from 'react';
import styles from './index.less';

export interface BlockProps {
  title: React.ReactNode;
  tip?: React.ReactNode;
}

const Block: React.FC<BlockProps> = (props) => {
  const { title, tip, children } = props;

  return (
    <dl className={styles.block}>
      <dt className={styles.blockTitle}>
        {title}
        {typeof tip !== 'undefined' && <span className={styles.blockTitleTip}>{tip}</span>}
      </dt>
      <dd className={styles.blockContent}>{children}</dd>
    </dl>
  );
};

export default Block;
