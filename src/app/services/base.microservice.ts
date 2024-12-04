import axios from "axios";
import { Injectable } from '@angular/core';
export const source = axios.CancelToken.source();
export const timeOut = 60000;

@Injectable()
export class BaseMicroService {
    public http = axios;
    constructor() { }
}