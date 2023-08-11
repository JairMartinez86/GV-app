import { Component } from "@angular/core";
import { LoginService } from "../../service/login.service";
import { Validacion } from "../../class/validacion";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogErrorComponent } from "../dialog-error/dialog-error.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  public val = new Validacion();

  public constructor(private _SrvLogin: LoginService, public dialog: MatDialog) {
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
      "6",
      "",
      "La contraseña debe de contener almenos 6 caracteres."
    );

   
    this.v_Limpiar();
    this._SrvLogin.isLogin();
  }

  private v_Limpiar() {
    this.val.Get("txtUsuario")?.setValue("");
    this.val.Get("txtPass")?.setValue("");
    this.val.Iniciar = true;
  }

  public v_Iniciar(): void {
    if (this.val.EsValido()) {
      this._SrvLogin.Session(this.val.ValForm.get("txtUsuario")?.value!, this.val.ValForm.get("txtPass")?.value!);
    } else {

      let dialogRef: MatDialogRef<DialogErrorComponent> = this.dialog.open(
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
    this.val.addFocus("txtPass", "btnIniciar", "click");

    
  }
}
