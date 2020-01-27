import request from 'request';
import { Config, FileConfig } from "./config";

export class ShimoSheetFetcher {
  private config: Config;
  private baseUrl: string = 'https://api.shimo.im';
  private rowBatch: number = 20;

  constructor(config: Config) {
    if (!config.username || !config.password) {
      throw new Error('Username and password needed');
    }
    this.config = config;
  }

  public async getFileData(fileConfig: FileConfig): Promise<any> {
    const token = await this.getToken();
    const fileContent = await this.getFileContent(token, fileConfig);
    return fileContent;
  }

  private async getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: `${this.baseUrl}/oauth/token`,
        headers: {
          authorization: 'Basic NTIxOUQyNjc5NjcxNEZCNTlFNkQ2NEVEREZEQTU1QkE6MDNDNTVFRERFOENENEZFRUFCMzIzQUNGNTBCOEMzQkM=',
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
          grant_type: 'password',
          username: this.config.username,
          password: this.config.password,
          scope: 'read'
        }
      };
      request(options, (err: any, _: any, body: string) => {
        if (err) {
          reject(err);
        }
        try {
          const data = JSON.parse(body);
          if (!data.access_token) {
            reject('Get access token error, body =' + body);
          }
          resolve(data.access_token);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private async getFileContent(accessToken: string, fileConfig: FileConfig): Promise<any> {
    let row = fileConfig.skipHead + 1;
    let range = '';
    const maxCol = this.getMaxColumn(fileConfig.columns.length);
    let done = false;
    let res: any[] = [];
    while (!done) {
      range = `${fileConfig.sheetName}!A${row}:${maxCol}${row + this.rowBatch}`;
      row += this.rowBatch;
      const values = await this.getFileContentRange(accessToken, fileConfig.guid, range);
      for (const row of values) {
        if (!row.some(v => v !== null)) {
          // blank row, all data get done
          done = true;
          break;
        }
        let rowData: any = {};
        row.forEach((v, i) => {
          rowData[fileConfig.columns[i].name] = v;
        });
        res.push(rowData);
      }
    }
    return res;
  }

  private getMaxColumn(num: number): string {
    return String.fromCharCode(65 + num - 1);   // 1 -> A, 2 -> B
  }

  private async getFileContentRange(accessToken: string, guid: string, range: string): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `${this.baseUrl}/files/${guid}/sheets/values`,
        qs: {
          range
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        }
      }
      request(options, function (err: any, _, body: string) {
        if (err) {
          reject(err);
        }
        try {
          const data = JSON.parse(body);
          if (!data.values) {
            reject('Get values error, body =' + body);
          }
          resolve(data.values);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
