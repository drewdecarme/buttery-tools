import { butteryConfigColorDefaultsPreset } from "@buttery/core/defaults";
import { produce } from "immer";
import { type FC, useMemo } from "react";
import { useConfigColorContext } from "./ConfigColor.context";

export const ConfigColorSelectSaturationBrightness: FC = () => {
  const { state, setState } = useConfigColorContext();

  const minMax = useMemo<{
    saturation: { min: number; max: number };
    brightness: { min: number; max: number };
  }>(() => {
    switch (state.mode) {
      case "presets":
        return {
          saturation: {
            min: butteryConfigColorDefaultsPreset[state.tone].min.saturation,
            max: butteryConfigColorDefaultsPreset[state.tone].max.saturation
          },
          brightness: {
            min: butteryConfigColorDefaultsPreset[state.tone].min.brightness,
            max: butteryConfigColorDefaultsPreset[state.tone].max.brightness
          }
        };

      default:
        return {
          saturation: { min: 0, max: 100 },
          brightness: { min: 0, max: 0 }
        };
    }
  }, [state]);

  return (
    <>
      <label>
        <div>saturation: {state.saturation}</div>
        <input
          type="range"
          {...minMax.saturation}
          step={1}
          value={state.saturation}
          onChange={({ currentTarget: { value } }) => {
            setState(
              produce((draft) => {
                draft.saturation = Number(value);
              })
            );
          }}
        />
      </label>
      <label>
        <div>brightness: {state.brightness}</div>
        <input
          type="range"
          {...minMax.brightness}
          step={1}
          value={state.brightness}
          onChange={({ currentTarget: { value } }) => {
            setState(
              produce((draft) => {
                draft.brightness = Number(value);
              })
            );
          }}
        />
      </label>
    </>
  );
};
