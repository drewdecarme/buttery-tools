import { css } from "@linaria/core";
import type { MenuOptionArrow, MenuOptionPosition } from "./menu.types";

const arrowBaseClassName = css`
  overflow: visible;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    height: 0;
    width: 0;
    left: var(--arrow-left);
    top: var(--arrow-top);
    display: block;
    border-right-color: green;
  }
`;

const arrowUp = css`
  &::after {
    border-left: calc(var(--arrow-size) / 2) solid transparent;
    border-right: calc(var(--arrow-size) / 2) solid transparent;
    border-bottom: var(--arrow-size) solid var(--arrow-color);
  }
`;

const arrowDown = css`
  &::after {
    border-left: calc(var(--arrow-size) / 2) solid transparent;
    border-right: calc(var(--arrow-size) / 2) solid transparent;
    border-top: var(--arrow-size) solid var(--arrow-color);
  }
`;

const arrowLeft = css`
  &::after {
    border-top: calc(var(--arrow-size) / 2) solid transparent;
    border-bottom: calc(var(--arrow-size) / 2) solid transparent;
    border-right: var(--arrow-size) solid var(--arrow-color);
  }
`;

const arrowRight = css`
  &::after {
    border-top: calc(var(--arrow-size) / 2) solid transparent;
    border-bottom: calc(var(--arrow-size) / 2) solid transparent;
    border-left: var(--arrow-size) solid var(--arrow-color);
  }
`;

const arrowClassNames: { [key in MenuOptionPosition]: string } = {
  "bottom-center": arrowUp,
  "bottom-left": arrowUp,
  "bottom-right": arrowUp,
  "top-center": arrowDown,
  "top-left": arrowDown,
  "top-right": arrowDown,
  "left-top": arrowRight,
  "left-middle": arrowRight,
  "left-bottom": arrowRight,
  "right-top": arrowLeft,
  "right-middle": arrowLeft,
  "right-bottom": arrowLeft,
};

export function setPopoverPositionStyles(
  position: MenuOptionPosition,
  {
    offset,
    arrow,
    popoverNode,
    targetNode,
  }: {
    arrow: MenuOptionArrow;
    offset: number;
    popoverNode: HTMLDivElement;
    targetNode: HTMLElement;
  }
) {
  const targetBox = targetNode.getBoundingClientRect();

  if (!targetBox) {
    return console.warn(
      "Cannot properly position menu near target. Target bounding box is `undefined`"
    );
  }

  const { popoverTop, popoverLeft, resolvedPosition } =
    calculatePopoverPosition(position, {
      targetBox,
      offset: arrow.size || offset,
      popover: {
        // using offsets here to ignore any scaling while also
        // factoring in padding, margin, border and possible scroll bars
        height: popoverNode.offsetHeight,
        width: popoverNode.offsetWidth,
      },
    });

  popoverNode.style.setProperty("top", `${popoverTop}px`);
  popoverNode.style.setProperty("left", `${popoverLeft}px`);

  if (!arrow) return;

  const { arrowLeft, arrowTop } = calculateArrowPosition(resolvedPosition, {
    targetBox,
    arrow: arrow.size,
    popoverLeft,
    popoverTop,
  });

  popoverNode.classList.add(arrowBaseClassName);
  popoverNode.style.setProperty("--arrow-size", `${arrow.size}px`);
  popoverNode.style.setProperty("--arrow-left", arrowLeft);
  popoverNode.style.setProperty("--arrow-top", arrowTop);
  popoverNode.style.setProperty("--arrow-color", arrow.color ?? "transparent");
  popoverNode.classList.add(arrowClassNames[resolvedPosition]);
}

function calculatePopoverPosition(
  position: MenuOptionPosition,
  {
    offset,
    targetBox,
    popover,
  }: {
    offset: number;
    targetBox: DOMRect;
    popover: { height: number; width: number };
  }
) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = 0;
  let left = 0;
  let resolvedPosition = position;

  switch (position) {
    case "top-left":
      top = targetBox.top - popover.height - offset;
      left = targetBox.left;
      resolvedPosition = position;
      break;
    case "top-center":
      top = targetBox.top - popover.height - offset;
      left = targetBox.left + targetBox.width / 2 - popover.width / 2;
      resolvedPosition = position;
      break;
    case "top-right":
      top = targetBox.top - popover.height - offset;
      left = targetBox.left + targetBox.width - popover.width;
      resolvedPosition = position;
      break;
    case "right-top":
      top = targetBox.top;
      left = targetBox.right + offset;
      resolvedPosition = position;
      break;
    case "right-middle":
      top = targetBox.top + targetBox.height / 2 - popover.height / 2;
      left = targetBox.right + offset;
      resolvedPosition = position;
      break;
    case "right-bottom":
      top = targetBox.bottom - popover.height;
      left = targetBox.right + offset;
      resolvedPosition = position;
      break;
    case "bottom-right":
      top = targetBox.bottom + offset;
      left = targetBox.left + targetBox.width - popover.width;
      resolvedPosition = position;
      break;
    case "bottom-center":
      top = targetBox.bottom + offset;
      left = targetBox.left + targetBox.width / 2 - popover.width / 2;
      resolvedPosition = position;
      break;
    case "bottom-left":
      top = targetBox.bottom + offset;
      left = targetBox.left;
      resolvedPosition = position;
      break;
    case "left-bottom":
      top = targetBox.bottom - popover.height;
      left = targetBox.left - popover.width - offset;
      resolvedPosition = position;
      break;
    case "left-middle":
      top = targetBox.top + targetBox.height / 2 - popover.height / 2;
      left = targetBox.left - popover.width - offset;
      resolvedPosition = position;
      break;
    case "left-top":
      top = targetBox.top;
      left = targetBox.left - popover.width - offset;
      resolvedPosition = position;
      break;
    default:
      break;
  }

  // Adjust positions if out of viewport
  if (top + popover.height > viewportHeight) {
    top = viewportHeight - popover.height;
  }
  if (left + popover.width > viewportWidth) {
    left = viewportWidth - popover.width;
  }
  if (top < 0) {
    top = 0;
  }
  if (left < 0) {
    left = 0;
  }

  return { popoverTop: top, popoverLeft: left, resolvedPosition };
}

function calculateArrowPosition(
  resolvedPosition: MenuOptionPosition,
  {
    targetBox,
    arrow,
    popoverLeft,
    popoverTop,
  }: {
    targetBox: DOMRect;
    arrow: number;
    popoverTop: number;
    popoverLeft: number;
  }
) {
  const relativeTargetOffsetLeftToPopover = targetBox.left - popoverLeft; // the relative left part of the target is to the popover
  const relativeTargetOffsetTopToPopover = targetBox.top - popoverTop; // the relative top part of the target is to the popover
  const halfOfTargetWidth = targetBox.width / 2;
  const halfOfTargetHeight = targetBox.height / 2;
  const halfOfArrow = arrow / 2;
  const offsetLeftCenterTarget = halfOfTargetWidth - halfOfArrow; // the left value of the horizontal center of the target
  const offsetTopCenterTarget = halfOfTargetHeight - halfOfArrow; // the top value of the vertical center of the target

  // calculate left
  let arrowLeft = "";
  let arrowTop = "";
  const adjustmentFactor = 0.15;
  if (resolvedPosition.startsWith("bottom")) {
    const top = arrow * -1;
    const left = relativeTargetOffsetLeftToPopover + offsetLeftCenterTarget;
    arrowTop = `${top - top * adjustmentFactor}px`;
    arrowLeft = `${left}px`;
  }

  if (resolvedPosition.startsWith("top")) {
    const left = relativeTargetOffsetLeftToPopover + offsetLeftCenterTarget;
    arrowTop = `calc(100% - ${arrow * adjustmentFactor}px)`;
    arrowLeft = `${left}px`;
  }

  if (resolvedPosition.startsWith("right")) {
    const top = relativeTargetOffsetTopToPopover + offsetTopCenterTarget;
    const left = arrow * -1;
    arrowTop = `${top}px`;
    arrowLeft = `${left - left * adjustmentFactor}px`;
  }

  if (resolvedPosition.startsWith("left")) {
    const top = relativeTargetOffsetTopToPopover + offsetTopCenterTarget;
    arrowTop = `${top}px`;
    arrowLeft = `calc(100% - ${arrow * adjustmentFactor}px)`;
  }

  return { arrowTop, arrowLeft };
}
