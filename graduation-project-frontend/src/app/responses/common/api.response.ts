export interface ApiResponse<T> {
    body: T;
    statusCode: number;
    message: string;
}