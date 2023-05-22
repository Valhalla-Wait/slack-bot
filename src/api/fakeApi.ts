import { readFileSync } from "fs";
import { QueryDataI } from "../types.js";

export class FakeApi {
    static fetchData() {
        return new Promise<QueryDataI[]>(
            resolve => setTimeout(() => {
              const json = readFileSync('./src/db/db.json', 'utf-8');
              const data = JSON.parse(json)
              resolve(data)
            }, 2000))
    }
}