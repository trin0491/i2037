import {NgModule} from "@angular/core";
import {LoginForm} from "./controllers/LoginForm";
import {FormsModule} from '@angular/forms';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [LoginForm]
})
export class AdminModule {}