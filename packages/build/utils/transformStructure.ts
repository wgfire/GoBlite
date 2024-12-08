/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeviceData {
  type: string;
  pageTemplate: string;
  languagePageMap: {
    [key: string]: {
      schema: any;
    };
  };
}

interface TransformedData {
  [key: string]: {
    pageTemplate: string;
    deviceType: {
      [key: string]: any;
    };
  };
}

export function transformStructure(data: DeviceData[]): TransformedData {
  const result: TransformedData = {};

  // Iterate through each device entry
  data.forEach(deviceEntry => {
    const { type: deviceType, pageTemplate, languagePageMap } = deviceEntry;

    // Iterate through each language in the device entry
    Object.entries(languagePageMap).forEach(([language, { schema }]) => {
      // Initialize language entry if it doesn't exist
      if (!result[language]) {
        result[language] = {
          pageTemplate,
          deviceType: {}
        };
      }

      // Add device data to the language entry
      result[language].deviceType[deviceType] = schema;
    });
  });

  return result;
}
