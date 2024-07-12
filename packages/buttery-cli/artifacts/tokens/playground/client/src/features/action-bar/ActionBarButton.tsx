import { classes } from "@buttery/components";
import { IconComponent, type IconNames } from "@buttery/icons";
import { makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "../../components/buttons";

export type ActionBarButtonPropsNative = JSX.IntrinsicElements["button"];
export type ActionBarButtonProps = ActionBarButtonPropsNative & {
  dxIcon: IconNames;
} & Pick<ButtonProps, "dxVariant">;
const SIconContainer = styled("div")`
  width: ${makeRem(18)};
  height: ${makeRem(18)};
`;

export const ActionBarButton = forwardRef<
  HTMLButtonElement,
  ActionBarButtonProps
>(function ActionBarButton({ children, className, dxIcon, ...restProps }, ref) {
  return (
    <Button {...restProps} className={classes(className)} ref={ref}>
      <SIconContainer>
        <IconComponent icon={dxIcon} />
      </SIconContainer>
      {children}
    </Button>
  );
});
