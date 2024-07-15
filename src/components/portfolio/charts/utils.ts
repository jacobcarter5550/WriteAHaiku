import moment from "moment";

export enum ChartTypeEnum {
  SECURITYCHAR = "securityCharacteristics",
  PORTFOLIOCHAR = "portfolioCharacteristics",
  RETURN = "portfolioReturn",
  SUMMARY = "portfolioSummary",
}

interface DataItem {
  group: string;
  date: string;
  value?: number;
  addValue?: number;
}

export function sortByDate(data: DataItem[]): DataItem[] {
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function convertArrayToDates(array: any[]) {
  return array.map((item) => {
    return {
      group: "Market Value",
      date: item.date,
      value: Math.floor(item.totalMarketValue),
    };
  });
}

export function formatNumber(num: number): string {
  if (Math.abs(num) >= 1e12) {
    return (num / 1e12).toFixed(3).replace(/\.?0+$/, "") + "t";
  } else if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(3).replace(/\.?0+$/, "") + "b";
  } else if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(3).replace(/\.?0+$/, "") + "m";
  } else if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(3).replace(/\.?0+$/, "") + "k";
  } else {
    return num.toString();
  }
}

export function formatAttributeData(data: InputData): DataItem[] {
  // Define the array to hold the formatted items
  let formattedData: DataItem[] = [];

  // Get the array of comparison attributes
  const comparisonAttributes = data.comparisonAttributes;

  // Loop over each comparison attribute by index
  comparisonAttributes.forEach((attribute, index) => {
    // Loop over each value in the current comparison attribute
    attribute.values.forEach((item) => {
      // Initialize an object to store the formatted data
      let formattedItem: DataItem = {
        group: attribute.attributeName,
        date: item.date,
      };

      // Assign 'value' to the first attribute and 'addValue' to the second attribute
      if (index === 0) {
        formattedItem.value = item.attributeValue;
      } else if (index === 1) {
        formattedItem.addValue = item.attributeValue;
      }

      // Add the formatted object to the result array
      formattedData.push(formattedItem);
    });
  });

  // Return the consolidated array of formatted items
  return formattedData;
}

export function extractGroupTitles(dataArray): string[] {
  // Create a new Set to hold unique group names
  const groupTitles = new Set();

  // Loop over each item in the array and add the 'group' property to the Set
  dataArray.forEach((item) => {
    groupTitles.add(item.group);
  });

  // Convert the Set back to an array to return it
  return Array.from(groupTitles);
}
