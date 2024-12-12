import type {
  ButteryTokensConfigColorBrandTypeAuto,
  ButteryTokensConfigColorBrandTypeManual,
  ButteryTokensConfigWellFormed,
} from "@buttery/tokens-utils/schemas";
import { butteryTokensConfigSchema } from "@buttery/tokens-utils/schemas";

export const initConfigColorAuto: ButteryTokensConfigColorBrandTypeAuto = {
  type: "fluorescent",
  brightness: 82,
  saturation: 63,
  colors: {},
};
export const initConfigColorManual: ButteryTokensConfigColorBrandTypeManual = {
  type: "manual",
  colors: {},
};

export const initConfig: ButteryTokensConfigWellFormed = {};
