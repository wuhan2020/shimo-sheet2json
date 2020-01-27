export interface Config {
  username: string;
  password: string;
}

export interface FileConfig {
  guid: string;
  sheetName: string;
  skipHead: number;
  columns: Array<{
    name: string,
    parser?: <T>(content: string) => T
  }>
}
