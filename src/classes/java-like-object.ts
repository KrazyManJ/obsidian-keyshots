export interface JavaLikeObject<T> {
    clone(): T

    equals(obj: T): boolean
}