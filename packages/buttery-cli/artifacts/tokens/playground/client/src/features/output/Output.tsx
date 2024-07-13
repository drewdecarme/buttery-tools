import { type FC, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ColorOutput } from "../../routes/color";

export const Output: FC = () => {
  const { pathname } = useLocation();
  const route = useMemo(() => {
    return pathname.split("/")[1];
  }, [pathname]);

  switch (route) {
    case "color":
      return <ColorOutput />;

    default:
      return (
        <div>Please select a category from the left nav to configure.</div>
      );
  }
};
