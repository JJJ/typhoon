import React, {useState, useEffect, useRef, forwardRef} from 'react';

import sum from 'lodash/sum';

import type {SplitPaneProps} from '../../typings/hyper';

const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>((props, ref) => {
  const dragPanePosition = useRef<number>(0);
  const dragTarget = useRef<HTMLDivElement | null>(null);
  const paneIndex = useRef<number>(0);
  const d1 = props.direction === 'horizontal' ? 'height' : 'width';
  const d2 = props.direction === 'horizontal' ? 'top' : 'left';
  const d3 = props.direction === 'horizontal' ? 'clientY' : 'clientX';
  const panesSize = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleAutoResize = (ev: React.MouseEvent<HTMLDivElement>, index: number) => {
    ev.preventDefault();

    paneIndex.current = index;

    const sizes_ = getSizes();
    sizes_[paneIndex.current] = 0;
    sizes_[paneIndex.current + 1] = 0;

    const availableWidth = 1 - sum(sizes_);
    sizes_[paneIndex.current] = availableWidth / 2;
    sizes_[paneIndex.current + 1] = availableWidth / 2;

    props.onResize(sizes_);
  };

  const handleDragStart = (ev: React.MouseEvent<HTMLDivElement>, index: number) => {
    ev.preventDefault();
    setDragging(true);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onDragEnd);

    const target = ev.target as HTMLDivElement;
    dragTarget.current = target;
    dragPanePosition.current = dragTarget.current.getBoundingClientRect()[d2];
    panesSize.current = target.parentElement!.getBoundingClientRect()[d1];
    paneIndex.current = index;
  };

  const getSizes = () => {
    const {sizes} = props;
    let sizes_: number[];

    if (sizes) {
      sizes_ = [...sizes.asMutable()];
    } else {
      const total = props.children.length;
      const count = new Array<number>(total).fill(1 / total);

      sizes_ = count;
    }
    return sizes_;
  };

  const onDrag = (ev: MouseEvent) => {
    const sizes_ = getSizes();

    const i = paneIndex.current;
    const pos = ev[d3];
    const d = Math.abs(dragPanePosition.current - pos) / panesSize.current!;
    if (pos > dragPanePosition.current) {
      sizes_[i] += d;
      sizes_[i + 1] -= d;
    } else {
      sizes_[i] -= d;
      sizes_[i + 1] += d;
    }
    props.onResize(sizes_);
  };

  const onDragEnd = () => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', onDragEnd);
    setDragging(false);
  };

  useEffect(() => {
    return () => {
      onDragEnd();
    };
  }, []);

  const {children, direction, borderColor} = props;
  const sizes = getSizes();
  const paneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    sizes.forEach((size, i) => {
      const paneSize = size * 100 + '%';
      paneRefs.current[i]?.style.setProperty('--pane-size', paneSize);
    });
  }, [sizes]);

  return (
    <div className={`splitpane_panes splitpane_panes_${direction}`} ref={ref}>
      {children.map((child, i) => {
        return (
          <React.Fragment key={i}>
            <div ref={(el) => (paneRefs.current[i] = el)} className="splitpane_pane ${direction}_pane pane_${i}">
              {child}
            </div>
            {i < children.length - 1 ? (
              <div
                onMouseDown={(e) => handleDragStart(e, i)}
                onDoubleClick={(e) => handleAutoResize(e, i)}
                className={`splitpane_divider splitpane_divider_${direction}`}
              />
            ) : null}
          </React.Fragment>
        );
      })}
      <div className="splitpane_shim" />

      <style jsx>
        {`
          .splitpane_panes {
            display: flex;
            flex: 1;
            outline: none;
            position: relative;
            width: 100%;
            height: 100%;
          }

          .splitpane_panes_vertical {
            flex-direction: row;
          }

          .splitpane_panes_horizontal {
            flex-direction: column;
          }

          .splitpane_pane {
            flex: 1;
            flex-grow: 0;
            flex-basis: var(--pane-size);
            outline: none;
            position: relative;
          }

          .splitpane_pane.horizontal_pane {
            height: var(--pane-size);
          }

          .splitpane_pane.vertical_pane {
            width: var(--pane-size);
          }

          .splitpane_divider {
            background-color: ${borderColor};
            box-sizing: border-box;
            z-index: 1;
            background-clip: padding-box;
            flex-shrink: 0;
          }

          .splitpane_divider_vertical {
            border-left: 5px solid rgba(255, 255, 255, 0);
            border-right: 5px solid rgba(255, 255, 255, 0);
            width: 11px;
            margin: 0 -5px;
            cursor: col-resize;
          }

          .splitpane_divider_horizontal {
            height: 11px;
            margin: -5px 0;
            border-top: 5px solid rgba(255, 255, 255, 0);
            border-bottom: 5px solid rgba(255, 255, 255, 0);
            cursor: row-resize;
            width: 100%;
          }

          /*
            this shim is used to make sure mousemove events
            trigger in all the draggable area of the screen
            this is not the case due to hterm's <iframe>
          */
          .splitpane_shim {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: transparent;
            display: ${dragging ? 'block' : 'none'};
          }
        `}
      </style>
    </div>
  );
});

SplitPane.displayName = 'SplitPane';

export default SplitPane;
