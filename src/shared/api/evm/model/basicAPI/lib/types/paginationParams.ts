export interface IPaginationWithPageParams {
    page?: number;
    offset?: number;
    sort?: "asc" | "desc";
}

export interface IPaginationParams extends IPaginationWithPageParams {
    startblock?: number;
    endblock?: number;
}
