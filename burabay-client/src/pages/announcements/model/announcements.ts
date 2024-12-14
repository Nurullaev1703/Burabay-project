export interface Category {
    id: string;
    name: string;
    subcategories: Subcategories[];
    description: string;
    imgPath: string;

}

export interface Subcategories {
    id: string;
    name: string;
}