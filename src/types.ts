
export interface PropertyDetailType {
    id: string,
    featured: boolean,
    name: string,
    description: string,
    type: string,
    category: string,
    price: number,
    currency: string,
    location: string,
    size: number,
    constructed: number,
    bedrooms: number,
    bathrooms: number,
    kitchen: number,
    garage: number,
    others: Array<string>,
    services: Array<string>,
    amenities: Array<string>,
    images: Images[]
    imageOrder: number[]
}

export interface Images {
    id: string
    url: string
    thumbnailUrl: string
}

export interface PropertyType {
    id: string,
    featured: boolean,
    name: string,
    description: string,
    type: string,
    category: string,
    price: number | undefined,
    currency: string,
    location: string,
    size: number | undefined,
    constructed: number | undefined,
    bedrooms: number | undefined,
    bathrooms: number | undefined,
    kitchen: number | undefined,
    garage: number | undefined,
    others: Array<string>,
    services: Array<string>,
    amenities: Array<string>,
    imageOrder: number[]
}

export interface CarouselItemType {
    id: string,
    original: string,
    thumbnail: string,
    name: string,
    location: string
    originalHeight: number
    originalWidth: number
    description: string
}

export interface PropertyListType {
    category:string
    featured:boolean
    id:string
    location:string
    name:string
    type:string
}