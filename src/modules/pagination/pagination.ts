import { SelectQueryBuilder } from "typeorm";

export class PaginationDto<T> {
    constructor(
        private queryBuilder: SelectQueryBuilder<T>,
        private page: number = 1,
        private limit: number = 10,
    ) { }

    async paginate(): Promise<{ data: T[], totalCount: number }> {
        const totalCount = await this.queryBuilder.getCount();
        const data = await this.queryBuilder.skip((this.page - 1) * this.limit).take(this.limit).getMany();

        return { data, totalCount }
    }
}