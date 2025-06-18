export interface Imagen {
  url: string;
}

export interface Franquicia {
  id: number;
  nombre: string;
  logo?: Imagen;
}

export interface Marca {
  id: number;
  nombre: string;
  logo?: Imagen;
}

export interface Linea {
  id: number;
  nombre: string;
  marca?: Marca;
  franquicias?: Franquicia[];
}

export interface Category {
  id: number;
  estado: string;
}

export interface Producto {
  id: number;
  Nombre: string;
  Precio: number;
  Tamano: string;
  Stock: number;
  Material: string;
  Resena: string;
  slug: string;
  Imagen: Imagen[];
  franquicia?: Franquicia;
  marca?: Marca;
  linea?: Linea;
  categories?: Category[];
}
