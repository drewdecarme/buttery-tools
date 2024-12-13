import { makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import { useCallback, useMemo } from "react";
import type { ChangeEventHandler } from "react";
import { match } from "ts-pattern";

import { InputRadioCard } from "~/components/InputRadioCard";

import { useConfigurationContext } from "./Config.context";
import { ConfigColorBrandModeManual } from "./ConfigColorBrandModeManual";
import { InputLabel } from "./InputLabel";
import { InputSection } from "./InputGroup";

const groupStyles = css`
  display: flex;
  gap: ${makeRem(16)};

  & > * {
    flex: 1;
  }
`;

const MagicWand01Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <title>wand</title>
    <path
      d="M13.9258 12.7775L11.7775 10.6292C11.4847 10.3364 11.3383 10.19 11.1803 10.1117C10.8798 9.96277 10.527 9.96277 10.2264 10.1117C10.0685 10.19 9.92207 10.3364 9.62923 10.6292C9.33638 10.9221 9.18996 11.0685 9.11169 11.2264C8.96277 11.527 8.96277 11.8798 9.11169 12.1803C9.18996 12.3383 9.33638 12.4847 9.62923 12.7775L11.7775 14.9258M13.9258 12.7775L20.3708 19.2225C20.6636 19.5153 20.81 19.6617 20.8883 19.8197C21.0372 20.1202 21.0372 20.473 20.8883 20.7736C20.81 20.9315 20.6636 21.0779 20.3708 21.3708C20.0779 21.6636 19.9315 21.81 19.7736 21.8883C19.473 22.0372 19.1202 22.0372 18.8197 21.8883C18.6617 21.81 18.5153 21.6636 18.2225 21.3708L11.7775 14.9258M13.9258 12.7775L11.7775 14.9258"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 2L17.2948 2.7966C17.6813 3.84117 17.8746 4.36345 18.2556 4.74445C18.6366 5.12545 19.1588 5.31871 20.2034 5.70523L21 6L20.2034 6.29477C19.1588 6.68129 18.6366 6.87456 18.2556 7.25555C17.8746 7.63655 17.6813 8.15883 17.2948 9.2034L17 10L16.7052 9.2034C16.3187 8.15884 16.1254 7.63655 15.7444 7.25555C15.3634 6.87455 14.8412 6.68129 13.7966 6.29477L13 6L13.7966 5.70523C14.8412 5.31871 15.3634 5.12545 15.7444 4.74445C16.1254 4.36345 16.3187 3.84117 16.7052 2.7966L17 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M6 4L6.22108 4.59745C6.51097 5.38087 6.65592 5.77259 6.94167 6.05834C7.22741 6.34408 7.61913 6.48903 8.40255 6.77892L9 7L8.40255 7.22108C7.61913 7.51097 7.22741 7.65592 6.94166 7.94167C6.65592 8.22741 6.51097 8.61913 6.22108 9.40255L6 10L5.77892 9.40255C5.48903 8.61913 5.34408 8.22741 5.05833 7.94167C4.77259 7.65592 4.38087 7.51097 3.59745 7.22108L3 7L3.59745 6.77892C4.38087 6.48903 4.77259 6.34408 5.05833 6.05833C5.34408 5.77259 5.48903 5.38087 5.77892 4.59745L6 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <title>pencil</title>
    <path
      d="M6 22V13.6944C6 12.1287 6 11.3459 6.21454 10.6077C6.42908 9.86948 6.84589 9.21812 7.6795 7.91542L10.3359 3.76419C11.0885 2.58806 11.4648 2 12 2C12.5352 2 12.9115 2.58806 13.6641 3.76419L16.3205 7.91542C17.1541 9.21812 17.5709 9.86948 17.7855 10.6077C18 11.3459 18 12.1287 18 13.6944V22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 11C7.63152 11.3231 8.4887 11.9732 9.28009 11.99a91C10.2988 12.0324 10.9868 11.1372 12 11.1372C13.0132 11.1372 13.7012 12.0324 14.7199 11.9991C15.5113 11.9732 16.3685 11.3231 17 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12L12 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 5H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ConfigColorBrandMode() {
  const { color, setColor } = useConfigurationContext();

  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value, checked } }) => {
      console.log({ value, checked });
      setColor((draft) => {
        draft.brand.type = value === "auto" ? "auto" : "manual";
      });
    },
    [setColor]
  );

  return (
    <>
      {useMemo(
        () => (
          <InputSection>
            <InputLabel
              dxLabel="Select how you would like to create colors"
              dxHelp="Each mode has different controls for adding and configuring colors and variants."
            />
            <div className={groupStyles}>
              <InputRadioCard
                DXIcon={PencilIcon}
                dxTitle="Manual"
                dxDescription="Manually add base colors using hex values to statically define variants"
                dxHelp="Best when configuring static colors provided by a design / product team"
                value="manual"
                name="mode"
                defaultChecked={color.brand.type === "manual"}
                onChange={handleOnChange}
              />
              <InputRadioCard
                DXIcon={MagicWand01Icon}
                dxTitle="Automatic"
                dxDescription="Select a preset palette 'tone' & add variants derived from tone preset scale."
                dxHelp="Best when starting from scratch without design assets"
                value="auto"
                name="mode"
                defaultChecked={color.brand.type === "auto"}
                onChange={handleOnChange}
              />
            </div>
          </InputSection>
        ),
        [color.brand.type, handleOnChange]
      )}
      <InputSection>
        {match(color.brand)
          .with({ type: "manual" }, (state) => (
            <ConfigColorBrandModeManual
              state={state.manual}
              setColor={setColor}
            />
          ))
          .with(
            { type: "auto" },
            (state) => null
            // <ConfigColorBrandModeManual state={state.auto} setConfig={setColor} />
          )
          .exhaustive()}
      </InputSection>
    </>
  );
}
