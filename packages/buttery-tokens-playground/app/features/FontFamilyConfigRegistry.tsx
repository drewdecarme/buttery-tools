import type { ConfigurationStateFontRegistryFamilyValues } from "./config.utils.font";
import type { FontFamilyConfigVariantProps } from "./FontFamilyConfigVariant";
import { FontFamilyConfigVariant } from "./FontFamilyConfigVariant";

export function FontFamilyConfigRegistry<
  T extends ConfigurationStateFontRegistryFamilyValues
>({ name, id, source, onAction, meta }: T & FontFamilyConfigVariantProps) {
  // const handleChangeFontFamily = useCallback<
  //   ChangeEventHandler<HTMLInputElement>
  // >(
  //   ({ currentTarget: { value } }) => {
  //     onAction({ action: "changeFontFamily", id, fontFamily: value });
  //   },
  //   [id, onAction]
  // );

  return (
    <FontFamilyConfigVariant
      id={id}
      name={name}
      source={source}
      meta={meta}
      onAction={onAction}
    >
      registry stuff
    </FontFamilyConfigVariant>
  );
}
