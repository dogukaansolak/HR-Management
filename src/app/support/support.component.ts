import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  submitted = false;

  onSubmit(form: any) {
    this.submitted = true;
    // Burada isteğe bağlı olarak form verilerini backend'e gönderebilirsiniz.
    // form içeriği: form.value.name, form.value.email, form.value.message
  }
}