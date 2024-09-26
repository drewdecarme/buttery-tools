import { css } from "@linaria/core";
import { randColor } from "@ngneat/falso";
import {
  type ChangeEventHandler,
  type FormEventHandler,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import {
  InputTextDropdown,
  useInputTextDropdown,
} from "../../../forms/InputTextDropdown";
import { Modal } from "../Modal";
import { useModal } from "../modal.useModal";

const styles = css`
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

const favorite_color = [...new Array(10)].map(() => randColor());

export default () => {
  const { modalRef, openModal } = useModal();
  const { ref, closeDropdown, setValue } = useInputTextDropdown();
  const id = useId();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Submission handler
  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const formDataObj = Object.fromEntries(formData.entries()) as Record<
        string,
        string
      >;
      // close the dropdown if add-color input exists
      if (Object.keys(formDataObj).includes("add-color")) {
        setValue(formDataObj["select-color"]);
      } else {
        alert(JSON.stringify(Object.fromEntries(formData.entries()), null, 2));
      }
    },
    [setValue]
  );

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setSearchTerm(value);
    },
    []
  );

  const handleSelectColor = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setValue(value);
    },
    [setValue]
  );

  // const handleCloseDropdown = useCallback(() => {
  //   closeDropdown();
  //   debugger;
  //   submitButtonRef.current?.focus();
  // }, [closeDropdown]);

  return (
    <>
      <button type="button" onClick={openModal}>
        Open a modal dialog form
      </button>
      <Modal
        id={id}
        ref={modalRef}
        className={styles}
        disableCloseOnEscapePress
      >
        <form onSubmit={handleSubmit}>
          <label>
            <div>First Name</div>
            <input type="text" name="first_name" required />
          </label>
          <label>
            <div>Age</div>
            <input type="number" name="age" required />
          </label>
          <label>
            <div>Favorite color</div>
            <InputTextDropdown
              dxOffset={4}
              dxPosition="bottom-left"
              onChange={handleSearch}
              name="favorite_color"
              ref={ref}
            >
              <ul>
                {favorite_color
                  .filter((g) =>
                    g.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((favorite_color) => (
                    <li key={favorite_color}>
                      <label key={favorite_color}>
                        <input
                          type="radio"
                          name="favorite_color"
                          value={favorite_color}
                          onChange={handleSelectColor}
                        />
                        {favorite_color}
                      </label>
                    </li>
                  ))}
              </ul>
              <div>
                <input type="text" name="select-color" />
                <input type="hidden" name="add-color" value="add-color" />
                <button type="submit">Add</button>
                {/* <button type="button" onClick={closeDropdown}>
                  done
                </button> */}
              </div>
            </InputTextDropdown>
          </label>
          <button type="submit" ref={submitButtonRef}>
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};
