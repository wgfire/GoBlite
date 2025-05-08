import { Image, useImageType } from "@/selectors/Image/Image.edit";
// Define component types union
type ComponentTypes = {
  Image: useImageType;
};

// Define available component names
type ComponentNames = keyof ComponentTypes;

// Type-safe component map
const componentMap: ComponentTypes = {
  Image: Image
};

export const resolveComponent = (name: string): ComponentTypes[ComponentNames] | undefined => {
  return componentMap[name as ComponentNames];
};
