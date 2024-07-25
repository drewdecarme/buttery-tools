import { randProduct } from "@ngneat/falso";
import { DropdownNav } from "../DropdownNav";
import { useDropdownNav } from "../dropdown-nav.useDropdownNav";

const products = [...new Array(4)].map(() => {
  const { title, category } = randProduct();
  return {
    title,
    category,
  };
});

export default () => {
  const { targetProps, dropdownProps } = useDropdownNav({
    id: "products-dropdown",
    dxOffset: 16,
    dxPosition: "bottom-center",
  });

  return (
    <nav>
      <ul
        style={{
          display: "flex",
          gap: "1rem",
          listStyleType: "none",
          padding: 0,
          margin: 0,
        }}
      >
        <li
          style={{
            padding: "0 1rem",
            display: "grid",
            alignContent: "center",
          }}
        >
          <a href="/">Home</a>
        </li>
        <li>
          <button type="button" {...targetProps}>
            Products
          </button>
          <DropdownNav {...dropdownProps}>
            <ul>
              {products.map((product) => (
                <li key={product.title}>
                  <a href={`/products/${product.title}`}>
                    <div>{product.title}</div>
                    <div>{product.category}</div>
                  </a>
                </li>
              ))}
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
