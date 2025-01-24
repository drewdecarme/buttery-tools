import { useModal } from "@buttery/components";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { NavLink } from "react-router";
import type { RefCallback } from "react";
import { useCallback } from "react";

import { IconMenu11 } from "~/icons/IconMenu11";
import { IconSettings05 } from "~/icons/IconSettings05";
import { IconDashboardSquare3 } from "~/icons/IconDashboardSquare3";

import { ModalDrawer } from "./ModalDrawer";
import { ModalHeader } from "./ModalHeader";
import { ModalBody } from "./ModalBody";

const styles = css`
  justify-self: end;
  .menu {
    ${makeReset("button")};
    height: ${makeRem(52)};
    aspect-ratio: 1 / 1;
    display: grid;
    place-content: center;
  }

  a {
    ${makeReset("anchor")};

    &.active {
      .item {
        background-color: ${makeColor("primary-100", { opacity: 0.2 })};
      }
    }
  }

  a.active {
  }

  ul {
    ${makeReset("ul")};
    display: flex;
    flex-direction: column;
    gap: ${makeRem(16)};
  }

  .item {
    width: ${makeRem(360)};
    padding: ${makeRem(16)};
    border-radius: ${makeRem(8)};
    display: grid;
    column-gap: ${makeRem(16)};
    grid-template-columns: ${makeRem(44)} auto;

    .icon {
      & > div {
        grid-area: icon;
        border-radius: ${makeRem(8)};
        display: grid;
        place-content: center;
        width: 100%;
        aspect-ratio: 1 / 1;
      }
      &.v-a {
        & > div {
          background: ${makeColor("primary")};
          color: white;
        }
      }
      &.v-b {
        & > div {
          background: ${makeColor("secondary")};
          color: ${makeColor("secondary-900")};
        }
      }
    }

    div {
      .title {
        font-size: ${makeRem(16)};
        font-weight: ${makeFontWeight("Mulish-bold")};
      }

      .sub {
        margin-top: ${makeRem(4)};
        font-size: ${makeRem(14)};
        color: ${makeColor("neutral-light", { opacity: 0.8 })};
      }
    }
  }
`;

export function LayoutHeaderMenu() {
  const { openModal, modalRef, closeModal } = useModal();

  /**
   * Callback ref to add a listener to all of the links
   * to close the modal once clicked
   */
  const ref = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      if (!node) return;
      const anchors = node.getElementsByTagName("a");
      for (const anchor of anchors) {
        anchor.addEventListener("click", closeModal);
      }

      return () => {
        for (const anchor of anchors) {
          anchor.removeEventListener("click", closeModal);
        }
      };
    },
    [closeModal]
  );
  return (
    <div className={styles}>
      <button className="menu" onClick={openModal}>
        <IconMenu11 dxSize={24} />
      </button>
      <ModalDrawer ref={modalRef} dxVariant="right-to-left">
        <ModalHeader>Options</ModalHeader>
        <ModalBody ref={ref}>
          <ul>
            <li>
              <NavLink to="/config">
                <div className="item">
                  <div className="icon v-a">
                    <div>
                      <IconSettings05 dxSize={28} />
                    </div>
                  </div>
                  <div>
                    <div className="title">Configure</div>
                    <div className="sub">
                      View, edit and save changes to your tokens configuration
                    </div>
                  </div>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects">
                <div className="item">
                  <div className="icon v-b">
                    <div>
                      <IconDashboardSquare3 dxSize={28} />
                    </div>
                  </div>
                  <div>
                    <div className="title">Projects</div>
                    <div className="sub">
                      View and manage all saved configurations for your projects
                    </div>
                  </div>
                </div>
              </NavLink>
            </li>
          </ul>
        </ModalBody>
      </ModalDrawer>
    </div>
  );
}
