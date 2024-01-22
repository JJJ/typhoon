import React, {forwardRef} from 'react';

import type {TabsProps} from '../../typings/hyper';
import {decorate, getTabProps} from '../utils/plugins';

import DropdownButton from './new-tab';
import Tab_ from './tab';

const Tab = decorate(Tab_, 'Tab');
const isMac = /Mac/.test(navigator.userAgent);

const Tabs = forwardRef<HTMLElement, TabsProps>((props, ref) => {
  const {tabs = [], borderColor = '#ccc', onChange, onClose, fullScreen} = props;

  return (
    <nav className={`tabs_nav ${fullScreen ? 'tabs_full_screen' : ''}`} ref={ref}>
      {props.customChildrenBefore}
      <>
        <ul key="list" className={`tabs_list ${fullScreen ? 'tabs_fullScreen' : ''}`}>
          {tabs.map((tab, i) => {
            const {uid, title, isActive, hasActivity} = tab;
            let text = 'Shell';

            if (title !== '') {
              text = title;
            } else if (typeof process.env.LOGNAME !== 'undefined') {
              text = process.env.LOGNAME;
            }

            const tabProps = getTabProps(tab, props, {
              text: text,
              isFirst: i === 0,
              isLast: tabs.length - 1 === i,
              borderColor,
              isActive,
              hasActivity,
              onSelect: onChange.bind(null, uid),
              onClose: onClose.bind(null, uid)
            });
            return <Tab key={`tab-${uid}`} {...tabProps} />;
          })}
        </ul>
      </>

      <DropdownButton {...props} />
      {props.customChildren}

      <style jsx>
        {`
          .tabs_nav {
            font-size: 12px;
            height: 34px;
            line-height: 34px;
            vertical-align: middle;
            color: #9b9b9b;
            cursor: default;
            position: relative;
            -webkit-user-select: none;
            -webkit-app-region: ${isMac ? 'drag' : ''};
            top: ${isMac ? '0px' : '34px'};
            display: flex;
            flex-flow: row;
          }

          .tabs_list {
            max-height: 34px;
            display: flex;
            flex-flow: row;
            flex-grow: 1;
            margin-left: ${isMac && !fullScreen ? '76px' : '0'};
          }

          .tabs_full_screen {
            margin-left: -1px;
          }
        `}
      </style>
    </nav>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
