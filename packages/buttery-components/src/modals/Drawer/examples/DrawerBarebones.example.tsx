import { Drawer } from "../Drawer";
import { useDrawer } from "../drawer.useDrawer";

export default () => {
  const { drawerRef, openDrawer } = useDrawer();

  return (
    <>
      <button type="button" onClick={openDrawer}>
        Open drawer without style
      </button>
      <Drawer ref={drawerRef} dxOrientation="slide-left">
        This is some drawer content!
      </Drawer>
    </>
  );
};
