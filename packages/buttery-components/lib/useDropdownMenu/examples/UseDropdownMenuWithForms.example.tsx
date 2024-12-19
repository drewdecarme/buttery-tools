import type { ChangeEventHandler } from "react";
import { useCallback, useState } from "react";
import { randAirline, randUuid } from "@ngneat/falso";

import { useDropdownMenu } from "../useDropdownMenu.js";

const options = [...new Array(10)].map(() => ({
  id: randUuid(),
  airline: randAirline(),
}));

export default () => {
  const { menuRef, targetRef } = useDropdownMenu<HTMLUListElement>();
  const [selectedOption, setSelectedOption] = useState<
    (typeof options)[0] | undefined
  >(undefined);

  const createHandleSelect = useCallback<
    (option: (typeof options)[0]) => ChangeEventHandler<HTMLInputElement>
  >(
    (option) => () => {
      setSelectedOption(option);
    },
    []
  );

  return (
    <>
      <button ref={targetRef}>open the menu</button>
      <ul ref={menuRef}>
        {options.map((option) => (
          <li key={option.id}>
            <label>
              <input
                type="radio"
                name="test"
                checked={option.id === selectedOption?.id}
                value={option.airline}
                onChange={createHandleSelect(option)}
              />
              <span>{option.airline}</span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};
