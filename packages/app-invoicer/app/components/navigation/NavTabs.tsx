import { styled } from "@linaria/react";

export const NavTabs = styled("nav")`
  width: 100%;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255);

  ul {
    display: flex;
    align-items: center;

    li {
      &:first-child {
        a {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
      }
      &:last-child {
        a {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }

    a {
      padding: 0 1rem;
      height: 32px;
      display: grid;
      place-items: center;
      background-color: white;

      &.active {
        color: white;
        background-color: rgba(var(--color-primary));
      }
    }
  }
`;
