export type SecurityDataType = {
  data: {
    group: string;
    key: string;
    value: number | null;
  }[];
  options: {
    toolbar: boolean;
    theme: string;
    axes: {
      left: {
        mapsTo: string;
      };
      bottom: {
        scaleType: string;
        mapsTo: string;
      };
    };
    height: string;
    width: string;
  };
  options2: {
    toolbar: boolean;
    theme: string;
    axes: {
      left: {
        mapsTo: string;
      };
      bottom: {
        scaleType: string;
        mapsTo: string;
      };
    };
    height: string;
    width: string;
  };
};

export type PerShareRow = {
  label: string;
  value1: string | null;
  value2: string | null;
  value3: string | null;
};

export type PerShareData = {
  title: string;
  rows: PerShareRow[];
};
