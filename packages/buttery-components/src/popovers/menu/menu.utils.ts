export type MenuOptionPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-top"
  | "right-middle"
  | "right-bottom"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left-bottom"
  | "left-middle"
  | "left-top";
export type MenuOptions = {
  dxPosition?: MenuOptionPosition;
};

export type MenuRef = {
  handleOpen: (options?: MenuOptions) => void;
  handleClose: () => void;
  handleToggle: (options?: MenuOptions) => void;
};

export function setPopoverPositionStyles(
  position: MenuOptionPosition,
  {
    popoverNode,
    targetNode,
  }: {
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

  const { top, left } = calculatePosition(position, {
    targetBox,
    popover: {
      // using offsets here to ignore any scaling while also
      // factoring in padding, margin, border and possible scroll bars
      height: popoverNode.offsetHeight,
      width: popoverNode.offsetWidth,
    },
  });

  popoverNode.style.setProperty("top", `${top}px`);
  popoverNode.style.setProperty("left", `${left}px`);
}

function calculatePosition(
  position: MenuOptionPosition,
  {
    targetBox,
    popover,
  }: { targetBox: DOMRect; popover: { height: number; width: number } }
) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = 0;
  let left = 0;

  switch (position) {
    case "top-left":
      top = targetBox.top - popover.height;
      left = targetBox.left;
      break;
    case "top-center":
      top = targetBox.top - popover.height;
      left = targetBox.left + targetBox.width / 2 - popover.width / 2;
      break;
    case "top-right":
      top = targetBox.top - popover.height;
      left = targetBox.left + targetBox.width - popover.width;
      break;
    case "right-top":
      top = targetBox.top;
      left = targetBox.right;
      break;
    case "right-middle":
      top = targetBox.top + targetBox.height / 2 - popover.height / 2;
      left = targetBox.right;
      break;
    case "right-bottom":
      top = targetBox.bottom - popover.height;
      left = targetBox.right;
      break;
    case "bottom-right":
      top = targetBox.bottom;
      left = targetBox.left + targetBox.width - popover.width;
      break;
    case "bottom-center":
      top = targetBox.bottom;
      left = targetBox.left + targetBox.width / 2 - popover.width / 2;
      break;
    case "bottom-left":
      top = targetBox.bottom;
      left = targetBox.left;
      break;
    case "left-bottom":
      top = targetBox.bottom - popover.height;
      left = targetBox.left - popover.width;
      break;
    case "left-middle":
      top = targetBox.top + targetBox.height / 2 - popover.height / 2;
      left = targetBox.left - popover.width;
      break;
    case "left-top":
      top = targetBox.top;
      left = targetBox.left - popover.width;
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

  return { top, left };
}
