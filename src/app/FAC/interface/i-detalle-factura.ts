export interface iDetalleFactura{
    IdVentaDetalle :string
    IdVenta: string
    Index:number;
    Codigo: string;
    Producto: string;
    Precio: number;
    PrecioCordoba: number;
    PrecioDolar: number;
    PorcDescuento: number;
    PorcDescuentoAdicional: number;
    PorcImpuesto: number;
    Cantidad: number;
    SubTotal:number;
    SubTotalCordoba:number;
    SubTotalDolar:number;
    Descuento:number;
    DescuentoCordoba:number;
    DescuentoDolar:number;
    DescuentoAdicional:number;
    DescuentoAdicionalCordoba:number;
    DescuentoAdicionalDolar:number;
    SubTotalNeto:number;
    SubTotalNetoCordoba:number;
    SubTotalNetoDolar:number;
    Impuesto:number;
    ImpuestoCordoba:number;
    ImpuestoDolar:number;
    ImpuestoExo:number;
    ImpuestoExoCordoba:number;
    ImpuestoExoDolar:number;
    Total:number;
    TotalCordoba:number;
    TotalDolar:number;
    EsBonif : boolean;
    EsBonifLibre : boolean;
    EsExonerado : boolean;
    PrecioLiberado : boolean;
    IndexUnion : number;
}