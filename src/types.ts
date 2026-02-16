export type DataType = 'rainfall' | 'et' | 'wy';

export interface MapConfig {
  id: DataType;
  label: string;
}

export interface GeoRaster {
  projection: number | string;
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  width: number;
  height: number;
  values: number[][][];
}
