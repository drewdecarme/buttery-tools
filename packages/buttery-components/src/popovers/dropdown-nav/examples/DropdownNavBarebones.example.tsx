import { DropdownNav, useDropdownNav } from "@buttery/components";

export default () => {
  const { targetProps, dropdownProps } = useDropdownNav({
    id: "barebones",
    dxPosition: "right-middle",
  });

  return (
    <nav>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <button type="button" {...targetProps}>
            Products
          </button>
          <DropdownNav {...dropdownProps}>
            <ul>
              <li>
                <a href="/products/sample">Sample</a>
              </li>
            </ul>
          </DropdownNav>
        </li>
        <li>
          <a href="/pricing">Pricing</a>
        </li>
      </ul>
    </nav>
  );
};
