import { useDropdownMenu } from "../useDropdownMenu.js";

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
