import { Component, ViewChild } from "@angular/core";
import { LoginService } from "../../service/login.service";
import { Validacion } from "../../class/validacion";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogErrorComponent } from "../dialog-error/dialog-error.component";
import { DynamicFormDirective } from "../../directive/dynamic-form.directive";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  public val = new Validacion();

  @ViewChild(DynamicFormDirective, { static: true }) DynamicFrom!: DynamicFormDirective;


  public constructor(private _SrvLogin: LoginService, private DIALOG: MatDialog) {
    this.val.add(
      "txtUsuario",
      "1",
      "LEN>",
      "0",
      "Usuario",
      "El usuario es requerido."
    );
    this.val.add(
      "txtPass",
      "1",
      "LEN>",
      "0",
      "Contraseña",
      "La contraseña es requerida"
    );
    this.val.add(
      "txtPass",
      "2",
      "LEN>=",
      "3",
      "",
      "La contraseña debe de contener almenos 3 caracteres."
    );

   
    this.v_Limpiar();
    this._SrvLogin.isLogin();
  }

  private v_Limpiar() {
    this.val.Get("txtUsuario")?.setValue("OFONSECA");
    this.val.Get("txtPass")?.setValue("1987");
    this.val.Iniciar = true;

    this.DynamicFrom?.viewContainerRef.clear();
    this.DIALOG.closeAll();
  }

  public v_Iniciar(): void {
    if (this.val.EsValido()) {
      this._SrvLogin.Session(this.val.ValForm.get("txtUsuario")?.value!, this.val.ValForm.get("txtPass")?.value!);
    } else {

      let dialogRef: MatDialogRef<DialogErrorComponent> = this.DIALOG.open(
        DialogErrorComponent,
        {
          data: this.val.Errores,
        }
      );

    }
  }


  
  private ngOnInit() {

    ///CAMBIO DE FOCO
    this.val.addFocus("txtUsuario", "txtPass", undefined);
    this.val.addFocus("txtPass", "btnLogin", "click");

    
  }
}
