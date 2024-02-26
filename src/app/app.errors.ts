/**
 * Raised when unknown internal application server error occurs
*/
export class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

/**
 * Raised when user provided wrong optional parameter name in the searchbar
 */
export class OptionalParamError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, OptionalParamError.prototype);
    }
}

/**
 * Raised when user provided an id of non-existing available column to display
*/
export class ColumnNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ColumnNotFoundError.prototype);
    }
}

/**
 * Raised when user provided wrong filter name in the searchbar
 */
export class FilterNameError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, FilterNameError.prototype);
    }
}

/**
 * Raised when user provided wrong value of certain filter in the searchbar
 */
export class FilterValueError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, FilterValueError.prototype);
    }
}