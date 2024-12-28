import { useDropdown } from "../useDropdown.js";

export default () => {
  const { openDropdown, closeDropdown, setDropdownRef, setTargetRef } =
    useDropdown({
      id: "use-dropdown",
      dxPosition: "bottom-right",
    });

  return (
    <>
      <button type="button" ref={setTargetRef} onClick={openDropdown}>
        Open Dropdown
      </button>
      <article
        ref={setDropdownRef}
        style={{
          border: "1px solid red",
          width: 300,
        }}
      >
        this is some dropdown where the top right is aligned
        <button type="button" onClick={closeDropdown}>
          Close Dropdown
        </button>
      </article>
    </>
  );
};
