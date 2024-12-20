import { useDropdownMenu } from "../useDropdownMenu.js";

/**
 * Suggestion - style the menu and use the hook wherever
 * Could also package it up into something that makes sense like consistent use of a context menu that only the icon can change
 */
export default () => {
  const { menuRef, targetRef } = useDropdownMenu<HTMLDivElement>();

  return (
    <>
      <button ref={targetRef}>open the menu</button>
      <div ref={menuRef}>
        <div style={{ width: 200, height: 400, backgroundColor: "purple" }} />
      </div>
    </>
  );
};
