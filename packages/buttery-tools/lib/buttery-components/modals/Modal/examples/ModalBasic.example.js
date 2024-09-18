import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { css } from "@linaria/core";
import { useCallback } from "react";
import { Modal } from "../Modal";
import { useModal } from "../modal.useModal";
const styles = css `
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

  /* Animation for fading in the :backdrop */
  @keyframes fade-in {
    0% {
      opacity: 0;
      visibility: hidden;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }

  /* Animation for fading out the :backdrop */
  @keyframes fade-out {
    0% {
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  display: block;
  padding: 0;
  border: 0;
  transition: backdrop-filter 1s ease;
  display: grid;
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &::backdrop {
    transition: backdrop-filter 1s ease;
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.4);
  }

  width: 40ch;

  form {
    display: grid;
    grid-template-rows: 64px auto 64px;

    header,
    footer {
      align-content: center;
    }

    header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
      align-items: center;
    }

    footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;
    }

    .body {
      & > * {
        display: block;
        margin-top: 1rem;
      }
    }

    & > * {
      padding: 0 1rem;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &[open] {
      animation: appear 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-in 0.35s ease-in-out forwards;
      }
    }
    &[data-close="true"] {
      animation: disappear 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-out 0.35s ease-in-out forwards;
      }
    }
  }
`;
export default function ModalBasic() {
    const { modalRef, openModal, closeModal } = useModal();
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        alert(JSON.stringify(Object.fromEntries(formData.entries())));
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: openModal, children: "Open Modal" }), _jsx(Modal, { ref: modalRef, className: styles, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("header", { children: [_jsx("h2", { children: "Enter user information" }), _jsx("button", { type: "button", onClick: closeModal, children: "close" })] }), _jsxs("div", { className: "body", children: [_jsxs("fieldset", { children: [_jsx("legend", { children: "full name" }), _jsxs("label", { children: [_jsx("div", { children: "First Name" }), _jsx("input", { type: "text", name: "first_name", required: true })] }), _jsxs("label", { children: [_jsx("div", { children: "Last Name" }), _jsx("input", { type: "text", name: "last_name", required: true })] })] }), _jsxs("label", { children: [_jsx("div", { children: "Phone Number" }), _jsx("input", { type: "tel", name: "phone", required: true })] })] }), _jsxs("footer", { children: [_jsx("button", { type: "button", onClick: closeModal, children: "Close" }), _jsx("button", { type: "submit", children: "Submit" })] })] }) })] }));
}
