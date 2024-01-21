import React, {useCallback, useRef, useEffect, forwardRef} from 'react';

import {VscArrowDown} from '@react-icons/all-files/vsc/VscArrowDown';
import {VscArrowUp} from '@react-icons/all-files/vsc/VscArrowUp';
import {VscCaseSensitive} from '@react-icons/all-files/vsc/VscCaseSensitive';
import {VscClose} from '@react-icons/all-files/vsc/VscClose';
import {VscRegex} from '@react-icons/all-files/vsc/VscRegex';
import {VscWholeWord} from '@react-icons/all-files/vsc/VscWholeWord';
import clsx from 'clsx';

import type {SearchBoxProps} from '../../typings/hyper';

type SearchButtonColors = {
  foregroundColor: string;
  selectionColor: string;
  backgroundColor: string;
};

type SearchButtonProps = React.PropsWithChildren<
  {
    onClick: () => void;
    active: boolean;
    title: string;
  } & SearchButtonColors
>;

const SearchButton = ({
  onClick,
  active,
  title,
  foregroundColor,
  backgroundColor,
  selectionColor,
  children
}: SearchButtonProps) => {
  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onClick();
      }
    },
    [onClick]
  );

  return (
    <div
      onClick={onClick}
      className={clsx('search-button', {'search-button-active': active})}
      tabIndex={0}
      onKeyUp={handleKeyUp}
      title={title}
    >
      {children}
      <style jsx>
        {`
          .search-button {
            cursor: pointer;
            color: ${foregroundColor};
            padding: 2px;
            margin: 4px 0;
            height: 18px;
            width: 18px;
            border-radius: 2px;
          }

          .search-button:focus {
            outline: ${selectionColor} solid 2px;
          }

          .search-button:hover {
            background-color: ${backgroundColor};
          }

          .search-button-active {
            background-color: ${selectionColor};
          }

          .search-button-active:hover {
            background-color: ${selectionColor};
          }
        `}
      </style>
    </div>
  );
};

const SearchBox = forwardRef<HTMLDivElement, SearchBoxProps>((props, ref) => {
  const {
    caseSensitive,
    wholeWord,
    regex,
    results,
    toggleCaseSensitive,
    toggleWholeWord,
    toggleRegex,
    next,
    prev,
    close,
    backgroundColor,
    foregroundColor,
    borderColor,
    selectionColor,
    font
  } = props;

  const searchTermRef = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      searchTermRef.current = event.currentTarget.value;
      if (event.shiftKey && event.key === 'Enter') {
        prev(searchTermRef.current);
      } else if (event.key === 'Enter') {
        next(searchTermRef.current);
      } else if (event.metaKey && event.key === 'a') {
        inputRef.current?.select();
      }
    },
    [prev, next]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef.current]);

  const searchButtonColors: SearchButtonColors = {
    backgroundColor: borderColor,
    selectionColor,
    foregroundColor
  };

  let resultsText = '';
  let resultsNavClass = 'hidden';

  if (results !== undefined) {
    if (results.resultIndex === -1) {
      // Empty search string
      resultsText = '';
      resultsNavClass = 'hidden';
    } else if (results.resultCount === 0) {
      // Empty search results
      resultsText = 'No results';
      resultsNavClass = 'hidden';
    } else {
      // Non-empty search results
      resultsText = `${results.resultIndex + 1} of ${results.resultCount}`;
      resultsNavClass = 'visible';
    }
  }

  return (
    <div className="flex-row search-container" ref={ref}>
      <div className="flex-row search-box">
        <input className="search-input" type="text" onKeyDown={handleChange} ref={inputRef} placeholder="Search" />

        <div className="flex-row search-toggles">
          <SearchButton onClick={toggleCaseSensitive} active={caseSensitive} title="Match Case" {...searchButtonColors}>
            <VscCaseSensitive size="14px" />
          </SearchButton>

          <SearchButton onClick={toggleWholeWord} active={wholeWord} title="Match Whole Word" {...searchButtonColors}>
            <VscWholeWord size="14px" />
          </SearchButton>

          <SearchButton onClick={toggleRegex} active={regex} title="Use Regular Expression" {...searchButtonColors}>
            <VscRegex size="14px" />
          </SearchButton>
        </div>
      </div>

      <span className="flex-row search-results">
        <span>{resultsText}</span>
        <div className={`flex-row search-nav ${resultsNavClass}`}>
          <SearchButton
            onClick={() => prev(searchTermRef.current)}
            active={false}
            title="Previous Match"
            {...searchButtonColors}
          >
            <VscArrowUp size="14px" />
          </SearchButton>

          <SearchButton
            onClick={() => next(searchTermRef.current)}
            active={false}
            title="Next Match"
            {...searchButtonColors}
          >
            <VscArrowDown size="14px" />
          </SearchButton>
        </div>
      </span>

      <div className="flex-row search-close">
        <SearchButton onClick={close} active={false} title="Close" {...searchButtonColors}>
          <VscClose size="14px" />
        </SearchButton>
      </div>

      <style jsx>
        {`
          .flex-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 4px;
          }

          .search-container {
            background-color: ${backgroundColor};
            border: 1px solid ${borderColor};
            border-radius: 2px;
            position: absolute;
            right: 13px;
            top: 4px;
            z-index: 10;
            padding: 4px;
            font-family: ${font};
            font-size: 12px;
          }

          .search-input {
            outline: none;
            background-color: transparent;
            border: none;
            color: ${foregroundColor};
            align-self: stretch;
            width: 100px;
          }

          .search-box {
            border: none;
            border-radius: 2px;
            outline: ${borderColor} solid 1px;
            background-color: ${backgroundColor};
            color: ${foregroundColor};
            padding: 0 4px;
          }

          .search-results {
            user-select: none;
          }

          .search-nav.hidden {
            display: none;
          }

          .search-close {
            margin-right: 4px;
          }

          .search-input::placeholder {
            color: ${foregroundColor};
          }

          .search-box:focus-within {
            outline: ${selectionColor} solid 2px;
          }
        `}
      </style>
    </div>
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;
