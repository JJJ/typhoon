import React, {forwardRef, useEffect, useRef, useState} from 'react';

import type {NotificationProps} from '../../typings/hyper';

const Notification = forwardRef<HTMLDivElement, React.PropsWithChildren<NotificationProps>>((props, ref) => {
  const dismissTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    setDismissTimer();
  }, []);

  useEffect(() => {
    // if we have a timer going and the notification text
    // changed we reset the timer
    resetDismissTimer();
    setDismissing(false);
  }, [props.text]);

  const handleDismiss = () => {
    setDismissing(true);
  };

  const onElement = (el: HTMLDivElement | null) => {
    if (el) {
      el.addEventListener('webkitTransitionEnd', () => {
        if (dismissing) {
          props.onDismiss();
        }
      });
      const {backgroundColor} = props;
      if (backgroundColor) {
        el.style.setProperty('background-color', backgroundColor, 'important');
      }

      if (ref) {
        if (typeof ref === 'function') ref(el);
        else ref.current = el;
      }
    }
  };

  const setDismissTimer = () => {
    if (typeof props.dismissAfter === 'number') {
      dismissTimer.current = setTimeout(() => {
        handleDismiss();
      }, props.dismissAfter);
    }
  };

  const resetDismissTimer = () => {
    clearTimeout(dismissTimer.current);
    setDismissTimer();
  };

  useEffect(() => {
    return () => {
      clearTimeout(dismissTimer.current);
    };
  }, []);

  const {backgroundColor = 'rgba(255, 255, 255, 0.2)', color = '#fff'} = props;
  const opacity = dismissing ? '0' : '1';
  return (
    <div ref={onElement} className="notification_indicator">
      {props.customChildrenBefore}
      {props.children || props.text}
      {props.userDismissable ? (
        <a className="notification_dismissLink" onClick={handleDismiss}>
          [x]
        </a>
      ) : null}
      {props.customChildren}

      <style jsx>
        {`
          .notification_indicator {
            display: inline-block;
            cursor: default;
            -webkit-user-select: none;
            background-color: ${backgroundColor};
            padding: 8px 14px 9px;
            margin-left: 10px;
            transition: 150ms opacity ease;
            color: ${color};
            opacity: ${opacity};
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
              'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          }

          .notification_dismissLink {
            position: relative;
            left: 4px;
            cursor: pointer;
            font-weight: 600;
            color: ${props.userDismissColor ? props.userDismissColor : 'currentColor'};
            transition: font-weight 0.1s ease-in-out;
          }

          .notification_dismissLink:hover,
          .notification_dismissLink:focus {
            font-weight: 900;
          }
        `}
      </style>
    </div>
  );
});

Notification.displayName = 'Notification';

export default Notification;
