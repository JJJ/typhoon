import React, {useRef, useState} from 'react';

import {VscChevronDown} from '@react-icons/all-files/vsc/VscChevronDown';
import useClickAway from 'react-use/lib/useClickAway';

import type {configOptions} from '../../typings/config';

interface Props {
  defaultProfile: string;
  profiles: configOptions['profiles'];
  openNewTab: (name: string) => void;
  backgroundColor: string;
  borderColor: string;
}
const isMac = /Mac/.test(navigator.userAgent);

const DropdownButton = ({defaultProfile, profiles, openNewTab, backgroundColor, borderColor}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useClickAway(ref, () => {
    setDropdownOpen(false);
  });

  return (
    <div
      ref={ref}
      title="New Tab"
      className={`new_tab ${dropdownOpen ? 'new_tab_active' : ''}`}
      onClick={toggleDropdown}
      onDoubleClick={(e) => e.stopPropagation()}
      onBlur={() => setDropdownOpen(false)}
    >
      <div className="profile_dropdown_icon">
        <VscChevronDown />
      </div>

      {dropdownOpen && (
        <ul key="dropdown" className="profile_dropdown">
          {profiles.map((profile) => (
            <li
              key={profile.name}
              onClick={() => {
                openNewTab(profile.name);
                setDropdownOpen(false);
              }}
              className={`profile_dropdown_item ${
                profile.name === defaultProfile && profiles.length > 1 ? 'profile_dropdown_item_default' : ''
              }`}
            >
              {profile.name}
            </li>
          ))}
        </ul>
      )}

      <style jsx>
        {`
          .profile_dropdown_icon {
            display: inline-block;
            vertical-align: middle;
          }

          .profile_dropdown {
            background-color: ${backgroundColor};
            border-color: ${borderColor};
            border-width: 1px;
            border-style: solid;
            border-bottom-width: 0;
            border-right-width: 0;
            position: absolute;
            top: 33px;
            right: 0;
            z-index: 1000;
            padding: 0;
            margin: 0;
            list-style-type: none;
            white-space: nowrap;
            min-width: 120px;
          }

          .profile_dropdown_item {
            padding: 0 20px;
            height: 34px;
            line-height: 34px;
            cursor: pointer;
            font-size: 12px;
            color: #fff;
            background-color: transparent;
            border-width: 0;
            border-style: solid;
            border-color: transparent;
            border-bottom-width: 1px;
            border-bottom-style: solid;
            border-bottom-color: ${borderColor};
            text-align: start;
            text-transform: capitalize;
          }

          .profile_dropdown_item:hover {
            background-color: ${borderColor};
          }

          .profile_dropdown_item_default {
            font-weight: bold;
          }

          .new_tab {
            position: fixed;
            right: 12px;
            top: 12px;
            cursor: pointer;
            color: #fff;
            padding: 2px;
            height: 22px;
            width: 22px;
            border-radius: 4px;
            background: transparent;
            text-align: center;
            -webkit-user-select: none;
            ${isMac ? '-webkit-app-region: drag;' : ''}
          }

          .new_tab:hover {
            background-color: ${borderColor};
          }

          .new_tab_active {
            background-color: ${borderColor};
          }
        `}
      </style>
    </div>
  );
};

export default DropdownButton;
