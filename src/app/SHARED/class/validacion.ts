import {
  AbstractControl,
  UntypedFormControl,
  ValidatorFn,
  FormGroupDirective,
  NgForm,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

import { formatDate } from "@angular/common";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { event } from "jquery";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

class ReglasValidacion {
  public Id: string = "";
  public Regla: string = "";
  public Condicon: string = "";
  public valor: string = "";
  public Mensaje: string = "";
  public Index: string = "";
}

interface I_Frm {
  Id: string;
  Frm: FormControl;
  Etiqueta: string;
}

interface iFocus {
  Id: string;
  IdNext: string;
  Evento : any;
}


const lstFocus: iFocus[] = [];


export class Validacion {
  
  private fb = new FormBuilder();
  public Iniciar: boolean = false;
  public Errores: string = "";
  private Index: string = "-1";

  private lstReglas: ReglasValidacion[] = [];
  private lstFrm: I_Frm[] = [];
 

  constructor() {}

  public ValForm = this.fb.nonNullable.group({});

  public CambioRegla(id: string, r: string): string {
    return this.lstReglas.filter((f) => f.Id == id && f.Regla == r)[0].valor;
  }

  public Get(id: string): any {
    return this.lstFrm.find((f) => f.Id == id)?.Frm;
  }

  public SetValue(id: string, value: any): any {
    let FormControl: FormControl = this.Get(id);
    return FormControl.setValue(value);
  }

  public add(
    id: string,
    regla: string,
    condicion: string,
    valor: string,
    etiqueta: string,
    msj: string
  ) {
    this.Index = String(Number.parseInt(this.Index) + 1);

    const _frm = new FormControl("", this.Cls_Validaciones(id));
    this.ValForm.addControl(id, _frm);
    const _Regla: ReglasValidacion = new ReglasValidacion();
    _Regla.Id = id;
    _Regla.Regla = regla;
    _Regla.Condicon = condicion;
    _Regla.valor = valor;
    _Regla.Mensaje = msj;
    _Regla.Index = this.Index + "_" + id;

    this.lstReglas.push(_Regla);
    if (this.Get(id) == undefined)
      this.lstFrm.push({ Id: id, Frm: _frm, Etiqueta: etiqueta });
  }

  public addFocus(id : string, idNext : string, evento : any){
    let i : number = lstFocus.findIndex(f => f.Id == id);

    if(i != -1){
      lstFocus[i].IdNext == idNext;
    }
    else{
      lstFocus.push({Id: id, IdNext : idNext, Evento : evento});

      document.querySelector('#' + id)?.addEventListener('keypress', this.onKeyEnter);
    }


   
  }

   onKeyEnter(event: any){

    if(event.key !== "Enter") return;

    
    let id : string = event.target.id;
    let _element_next  = lstFocus.find(f => f.Id == id);

    if(_element_next == undefined) return;


    document?.getElementById(_element_next.IdNext)?.focus();

    if(String(_element_next.Evento) != undefined) $("#" + _element_next.IdNext)?.trigger(_element_next.Evento);

    /*
    if(String(event.target.value) == "") {
      document?.getElementById(_input)?.focus();
      event.preventDefault();
      return;
    }*/


    event.preventDefault();

  }

  public del(id: string): void {
    let i: number = this.lstReglas.findIndex((f) => f.Id == id);

    if (i == -1) return;

    this.ValForm.removeControl(id);
    this.lstReglas.splice(i, 1);
  }

  public delRule(id: string, regla: string): void {
    let i: number = this.lstReglas.findIndex(
      (f) => f.Id == id && f.Regla == regla
    );

    if (i == -1) return;
    this.lstReglas.splice(i, 1);
  }

  public replace(
    id: string,
    rule: string,
    condicion: string,
    valor: string,
    msj: string
  ): void {
    let i: number = this.lstReglas.findIndex(
      (f) => f.Id == id && f.Regla == rule
    );
    this.lstReglas[i].Condicon = condicion;
    this.lstReglas[i].valor = valor;
    this.lstReglas[i].Mensaje = msj;
  }

  public EsValido(): boolean {
    this.Errores = "";

    let i: number = 0;
    let er: string = "";

    this.lstReglas.sort((a, b) => a.Index.localeCompare(b.Index));

    this.lstReglas.forEach((f) => {
      let retorno = "0";
      let errores = "";
      let frm: any = this.Get(f.Id);
      let etiqueta: string = this.lstFrm.find((ff) => ff.Id == f.Id)?.Etiqueta!;

      let r: string[] = this._Validar(f.Id, f, frm, retorno, errores);

      if (r[1] != "" && f.Mensaje != "") {
        er += "<li class='error-mensaje'>" + f.Mensaje + "</li>";

        if (i + 1 < this.lstReglas.length) {
          if (this.lstReglas[i + 1].Id != f.Id) {
            this.Errores += "<li class='error-etiqueta'>" + etiqueta + "<ul>" + er + "</ul></li>";
            er = "";
          }
        } else {
          this.Errores += "<li class='error-etiqueta'>" + etiqueta + "<ul>" + er + "</ul></li>";
          er = "";
        }
      }

      i++;
    });

    if (this.Errores != "") {
      this.Errores = "<ul>" + this.Errores + "</ul>";
      return false;
    }

    return true;
  }

  private Cls_Validaciones(id: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string } | null => {
      if (!this.Iniciar) return { Regla: "" };

      let retorno = "0";
      let errores = "";

      this.lstReglas
        .filter((f) => f.Id == id)
        .forEach((element) => {
          let r: string[] = this._Validar(
            id,
            element,
            control,
            retorno,
            errores
          );

          retorno = r[0];
          errores = r[1];
        });

      if (errores == "") {
        return null;
      }

      return { Regla: retorno };
    };
  }

  private _Validar(
    id: string,
    element: ReglasValidacion,
    control: AbstractControl,
    retorno: string,
    errores: string
  ): string[] {
    if (id == element.Id && errores == "") {
      retorno = element.Regla;

      let str_cadena = String(control.value);
      let dtFecha1!: Date;
      let dtFecha2!: Date;
      let parts: string[];

      if (str_cadena == undefined || str_cadena == "null") {
        str_cadena = "";
      }

      switch (element.Condicon) {
        case "LEN>":
          if (!(str_cadena.length > Number(element.valor))) errores = "1";

          break;

        case "LEN<":
          if (!(str_cadena.length < Number(element.valor))) errores = "1";

          break;

        case "LEN>=":
          if (!(str_cadena.length >= Number(element.valor))) errores = "1";

          break;

        case "LEN<=":
          if (!(str_cadena.length <= Number(element.valor))) errores = "1";

          break;

        case "LEN==":
          if (!(str_cadena.length == Number(element.valor))) errores = "1";

          break;

        case "NUM>":
          if (!(Number(str_cadena.replaceAll(",", "")) > Number(element.valor))) errores = "1";

          break;

        case "NUM<":
          if (!(Number(str_cadena.replaceAll(",", "")) < Number(element.valor))) errores = "1";

          break;

        case "NUM>=":
          if (!(Number(str_cadena.replaceAll(",", "")) >= Number(element.valor))) errores = "1";

          break;

        case "NUM<=":
          if (!(Number(str_cadena.replaceAll(",", "")) <= Number(element.valor))) errores = "1";

          break;

        case "NUM==":
          if (!(Number(str_cadena.replaceAll(",", "")) == Number(element.valor))) errores = "1";

          break;

        case "DATE":
          if (str_cadena == "") {
            errores = "1";
          } else {
            if (!this.ValidarFecha(str_cadena)) {
              errores = "1";
            }
          }

          break;

        case "DATE>":
          str_cadena = formatDate(new Date(str_cadena), "dd/MM/yyyy", "en-US");

          parts = str_cadena.split("/");
          dtFecha1 = new Date(
            Number.parseInt(parts[2]),
            Number.parseInt(parts[1]),
            Number.parseInt(parts[0])
          );

          parts = element.valor.split("/");
          dtFecha2 = new Date(
            Number.parseInt(parts[2]),
            Number.parseInt(parts[1]),
            Number.parseInt(parts[0])
          );

          if (!this.ValidarFecha(str_cadena)) {
            if (dtFecha1 > dtFecha2) {
              errores = "1";
            }
          }

          break;

        case "CORREO":
          if (str_cadena == "") {
            errores = "1";
          } else {
            if (!this.ValidarCorreo(str_cadena)) {
              errores = "1";
            }
          }

          break;
      }
    }

    return [retorno, errores];
  }

  private ValidarFecha(fecha: string) {
    let match!: any;

    match = fecha.match(/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/);
    if (match) {
      return true;
    } else if (match && match[0] == fecha) {
      return true;
    }

    return false;
  }

  private ValidarCorreo(correo: string) {
    let match!: any;

    match = correo.match(
      /^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
    if (match) {
      return true;
    }
    return false;
  }

  parse(value: any): Date | null {
    if (typeof value === "string" && value.indexOf("/") > -1) {
      const str = value.split("/");

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    } else if (typeof value === "string" && value === "") {
      return new Date();
    }
    const timestamp = typeof value === "number" ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }




}
