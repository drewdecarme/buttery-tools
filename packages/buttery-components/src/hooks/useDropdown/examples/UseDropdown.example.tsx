import { useRef } from "react";
import { useDropdown } from "../hook.useDropdown";

export const ExampleUseDropdown = () => {
  const targetRef = useRef<HTMLButtonElement | null>(null);
  const { openDropdown, closeDropdown, dropdownRef } = useDropdown(targetRef);

  return (
    <>
      <button type="button" ref={targetRef} onClick={openDropdown}>
        Open Dropdown
      </button>
      <article
        ref={dropdownRef}
        style={{
          border: "1px solid red",
        }}
      >
        this is some dropdown content
        <button type="button" onClick={closeDropdown}>
          Close Dropdown
        </button>
      </article>
    </>
  );
};
