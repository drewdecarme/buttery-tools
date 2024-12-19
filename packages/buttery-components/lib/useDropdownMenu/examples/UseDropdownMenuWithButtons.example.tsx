import { randAnimal, randUuid } from "@ngneat/falso";

import { useDropdownMenu } from "../useDropdownMenu.js";

const options = [...new Array(10)].map(() => ({
  id: randUuid(),
  animal: randAnimal(),
}));

export default () => {
  const { menuRef, targetRef } = useDropdownMenu<HTMLUListElement>();

  return (
    <>
      <button ref={targetRef}>open the menu</button>
      <ul ref={menuRef}>
        {options.map((option) => (
          <li key={option.id}>
            <button>{option.animal}</button>
          </li>
        ))}
      </ul>
    </>
  );
};
