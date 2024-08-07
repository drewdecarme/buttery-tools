import { DropdownMenu } from "../DropdownMenu";
import { useDropdownMenu } from "../dropdown-menu.useDropdownMenu";

export default () => {
  const { targetProps, dropdownProps } = useDropdownMenu({
    id: "barebones",
  });

  return (
    <>
      <button type="button" {...targetProps}>
        Toggle Context Menu
      </button>
      <DropdownMenu {...dropdownProps}>
        <ul>
          <li>
            <button type="button">Print</button>
          </li>
          <li>
            <button type="button">Send</button>
          </li>
          <li>
            <button type="button">Forward</button>
          </li>
          <li>
            <button type="button">Delete</button>
          </li>
        </ul>
      </DropdownMenu>
    </>
  );
};
