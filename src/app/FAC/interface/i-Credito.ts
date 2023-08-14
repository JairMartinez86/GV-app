export interface iCredito{
    CodCliente: string;
    Limite: number;
    Plazo: number;
    Gracia : number;
    Moneda: string;
    Disponible: number;
    FacturarVencido :boolean;
    SaldoVencido : number;
}