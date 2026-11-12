import localEthicsFramework from "../../data/vde_spec_90012.json";

export const FRAMEWORK_DISPLAY_NAME = "VDE Spec 90012";

export const LOCAL_ETHICS_FRAMEWORK = {
  ...localEthicsFramework,
  metadata: {
    ...localEthicsFramework.metadata,
    source: FRAMEWORK_DISPLAY_NAME,
  },
};
