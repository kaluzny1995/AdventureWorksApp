import { EOrderType } from "./e-order-type"

export class QueryParams {
    public page: number
    public perPage: number
    public filters: {[key: string]: string} | null
    public orderBy: string | null
    public type: EOrderType

    constructor(page: number, perPage: number, filters: {[key: string]: string} | null, orderBy: string | null, type: EOrderType) {
        this.page = page;
        this.perPage = perPage;
        this.filters = filters;
        this.orderBy = orderBy;
        this.type = type;
    }
}
