import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface ProductInput {
    name: string;
    description: string;
    available: boolean;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface Cart {
    items: Array<CartItem>;
    totalPrice: bigint;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface InquiryInput {
    name: string;
    productId?: bigint;
    email: string;
    message: string;
    phone: string;
}
export interface Inquiry {
    id: bigint;
    resolved: boolean;
    name: string;
    productId?: bigint;
    email: string;
    message: string;
    phone: string;
}
export type Category = string;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: Category): Promise<void>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createProduct(productInput: ProductInput): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    filterProductsByCategory(category: string): Promise<Array<Product>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(productId: bigint): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<Category>>;
    listProducts(): Promise<Array<Product>>;
    markInquiryResolved(inquiryId: bigint): Promise<void>;
    removeCategory(category: Category): Promise<void>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProductsByName(searchTerm: string): Promise<Array<Product>>;
    submitInquiry(inquiryInput: InquiryInput): Promise<void>;
    updateProduct(productId: bigint, productInput: ProductInput): Promise<void>;
    viewCart(): Promise<Cart>;
}
