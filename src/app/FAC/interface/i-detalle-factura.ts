export interface iDetalleFactura{
    Index:number;
    Codigo: string;
    Producto: string;
    Precio: number;
    PorcDescuento: number;
    PorcImpuesto: number;
    Cantidad: number;
    SubTotal:number;
    Descuento:number;
    SubTotalNeto:number;
    Impuesto:number;
    TotalCordoba:number;
    TotalDolar:number;
}