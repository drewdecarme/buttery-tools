import { css } from "@linaria/core";
import type { Meta, StoryObj } from "@storybook/react";
import type { DropdownOptionArrow, DropdownOptionPosition } from "../../hooks";
import { DropdownMenu } from "./DropdownMenu";
import { useDropdownMenu } from "./dropdown-menu.useDropdownMenu";

const MenuCSS = css`
  opacity: 0;
  border: none;
  transform: scale(0.9);
  filter: drop-shadow(3px 8px 28px rgba(130, 130, 130, 0.3));
  border-radius: 0.5rem;

  header {
    padding: 1rem;
    h1,
    h2 {
      margin: 0;
    }
  }
  & > div {
    padding: 0 1rem;
  }
  footer {
    padding: 1rem;
  }

  /* Animation for appearing */
  @keyframes appear {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation for disappearing */
  @keyframes disappear {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  &.open {
    animation: appear 0.15s forwards;
  }

  &.close {
    animation: disappear 0.15s forwards;
  }
`;

function MenuExample({
  top,
  left,
  right,
  bottom,
  label,
  arrow,
  offset,
}: {
  label: DropdownOptionPosition;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  arrow?: DropdownOptionArrow;
  offset?: number;
}) {
  const { targetProps, dropdownProps, closeMenu } = useDropdownMenu({
    id: label,
    dxPosition: label,
    dxArrow: arrow,
    dxOffset: offset,
  });
  return (
    <>
      <button
        {...targetProps}
        style={{
          position: "fixed",
          top,
          left,
          right,
          bottom,
          width: 100,
          height: 44,
        }}
      >
        {label}
      </button>
      <DropdownMenu
        {...dropdownProps}
        className={MenuCSS}
        style={{
          width: 300,
        }}
      >
        <header>
          <h2>This is a menu</h2>
        </header>
        <div>
          Sed posuere consectetur est at lobortis. Maecenas sed diam eget risus
          varius blandit sit amet non magna. Nulla vitae elit libero, a pharetra
          augue. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          Nullam id dolor id nibh ultricies vehicula ut id elit. Integer posuere
          erat a ante venenatis dapibus posuere velit aliquet. Maecenas sed diam
          eget risus varius blandit sit amet non magna. Fusce dapibus, tellus ac
          cursus commodo, tortor mauris condimentum nibh, ut fermentum massa
          justo sit amet risus. Sed posuere consectetur est at lobortis. Duis
          mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit.
        </div>
        <footer>
          <button type="button" onClick={closeMenu}>
            Close
          </button>
        </footer>
      </DropdownMenu>
    </>
  );
}
type MenuGridProps = {
  arrow?: DropdownOptionArrow;
  offset?: number;
};
function MenuGrid({ arrow, offset }: MenuGridProps) {
  return (
    <>
      {/* bottom */}
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="bottom-left"
        top={10}
        left={10}
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="bottom-center"
        top={10}
        left="calc(50% - 50px)"
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="bottom-right"
        top={10}
        right={10}
      />
      {/* left */}
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="left-top"
        top={66}
        right={10}
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="left-middle"
        top={"calc(50% - 22px)"}
        right={10}
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="left-bottom"
        bottom={66}
        right={10}
      />
      {/* top */}
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="top-right"
        bottom={10}
        right={10}
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="top-center"
        bottom={10}
        left="calc(50% - 50px)"
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="top-left"
        bottom={10}
        left={10}
      />
      {/* right */}
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="right-bottom"
        bottom={66}
        left={10}
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="right-middle"
        top={"calc(50% - 22px)"}
        left={10}
      />
      <MenuExample
        arrow={arrow}
        offset={offset}
        label="right-top"
        top={66}
        left={10}
      />
    </>
  );
}

const meta: Meta = {
  // @ts-ignore
  component: MenuGrid,
  title: "Popovers / DropdownMenu",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {} as MenuGridProps,
};

export const WithOffset: Story = {
  args: {
    offset: 16,
  } as MenuGridProps,
};

export const WithArrow: Story = {
  args: {
    arrow: {
      size: 16,
      color: "white",
    },
  } as MenuGridProps,
};
