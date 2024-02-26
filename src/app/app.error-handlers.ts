import { ErrorHandler } from "@angular/core";
import { InternalServerError } from "./app.errors";

export class CustomErrorHandler implements ErrorHandler {
    handleError(error: unknown): void {
        if (error instanceof Object) {
            if (error.toString().includes('Cannot have two MatSortables with the same id')) {
                const matches: RegExpExecArray | null = /\(([^)]+)\)/.exec(error.toString());
                if (matches !== null) {
                    console.warn(`Duplicated sorting header '${matches[1]}'.`)
                }
            } else {
                throw error;
            }
        } else {
            throw error;
        }
    }
}