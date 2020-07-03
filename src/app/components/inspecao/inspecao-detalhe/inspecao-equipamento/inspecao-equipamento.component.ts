import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { InspecaoService } from 'src/app/services/Inspecao.service';
import { InspecaoDTO } from 'src/app/models/InspecaoDTO';


@Component({
  selector: 'app-inspecao-equipamento',
  templateUrl: './inspecao-equipamento.component.html',
  styleUrls: ['./inspecao-equipamento.component.css'],
})
export class InspecaoEquipamentoComponent implements OnInit {
  formInspecao : FormGroup;
  inspecao: InspecaoDTO;
  date = new FormControl(new Date());
  dateMonthYear: any[] = []; 
  agendamentoSeleted: any;
  opcoesInspecao: {opcao:string; value:string}[] = [{opcao:'Conforme', value:'C'}, {opcao:'Não Conforme', value:'NC'}, {opcao:'Não Aplicável', value:'NA'}];
  isLoading: boolean;
  metodoApi = 'postInspecao';
  @ViewChild("autosize") autosize: CdkTextareaAutosize;

  private formSubmitAttempt: boolean;

  constructor(
    public dialogRef: MatDialogRef<InspecaoEquipamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private inspecaoService: InspecaoService) {}

  ngOnInit(): void {
    this.agendamentoSeleted = JSON.parse(localStorage.getItem('AgendaSeleted'));
    this.createDropdownMonthYear();
    if(this.data.inspecao){
      this.montaInfoInspecao();
    }
    else {
      this.createFormInpecao();
    }

  }

  montaInfoInspecao() {
    this.formInspecao = this.fb.group({
      id:[this.data.inspecao.id],
      statusInspManutId: [this.data.inspecao.statusInspManutId],
      funcionarioId: [this.data.inspecao.funcionarioId],
      empresaClienteId: [this.data.inspecao.empresaClienteId],
      agendaInspManutId: [this.data.inspecao.agendaInspManutId],
      equipamentoSegurancaId: [this.data.inspecao.equipamentoSegurancaId],
      ultimaRec_Insp: [this.data.inspecao.ultimaRec_Insp, Validators.compose([Validators.required])],
      proximoRec_Insp: [this.data.inspecao.proximoRec_Insp, Validators.compose([Validators.required])],
      ultimoReteste_Insp: [this.data.inspecao.ultimoReteste_Insp, Validators.compose([Validators.required])],
      proximoReteste_Insp: [this.data.inspecao.proximoReteste_Insp, Validators.compose([Validators.required])],
      estadoCilindro_Insp: [this.data.inspecao.estadoCilindro_Insp, Validators.compose([Validators.required])],
      estadoLocal_Insp: [this.data.inspecao.estadoLocal_Insp, Validators.compose([Validators.required])],
      seloLacre_insp: [this.data.inspecao.seloLacre_insp, Validators.compose([Validators.required])],
      sinalizacaoPiso_insp: [this.data.inspecao.sinalizacaoPiso_insp, Validators.compose([Validators.required])],
      sinalizacaoAcesso_insp: [this.data.inspecao.sinalizacaoAcesso_insp, Validators.compose([Validators.required])],
      obs_Insp: [this.data.inspecao.obs_Insp, Validators.compose([Validators.required])],
      dataInicial: [this.data.dataIncial],
      dataFinal: [this.data.inspecao.dataFinal],
      duracao: [this.data.inspecao.duracao]
    });

    this.metodoApi = 'putInspecao';
  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  createFormInpecao() : void {
    this.formInspecao = this.fb.group({
      id:[''],
      statusInspManutId: [3],
      funcionarioId: [this.agendamentoSeleted.funcId],
      empresaClienteId: [this.agendamentoSeleted.empId],
      agendaInspManutId: [this.agendamentoSeleted.ageId],
      equipamentoSegurancaId: [this.data.equip.equipamentoId],
      ultimaRec_Insp: ['', Validators.compose([Validators.required])],
      proximoRec_Insp: ['', Validators.compose([Validators.required])],
      ultimoReteste_Insp: ['', Validators.compose([Validators.required])],
      proximoReteste_Insp: ['', Validators.compose([Validators.required])],
      estadoCilindro_Insp: ['', Validators.compose([Validators.required])],
      estadoLocal_Insp: ['', Validators.compose([Validators.required])],
      seloLacre_insp: ['', Validators.compose([Validators.required])],
      sinalizacaoPiso_insp: ['', Validators.compose([Validators.required])],
      sinalizacaoAcesso_insp: ['', Validators.compose([Validators.required])],
      obs_Insp: ['', Validators.compose([Validators.required])],
      dataInicial: [this.data.dataIncial],
      dataFinal: [''],
      duracao: ['']
    });

    // this.formInspecao.valueChanges.subscribe(data => console.log('form changes', data));
  }

  salvarInspecao(): void {
    this.formInspecao.controls.dataFinal.patchValue(this.date.value);
    this.inspecao = this.formInspecao.value;
  
    this.isLoading = !this.isLoading;
    this.inspecaoService[this.metodoApi](this.inspecao).subscribe(
      () => {
        this.isLoading = !this.isLoading;
        this.inspecaoService.showMessage("Equipamento inspecionado com sucesso!");
        this.onNoClick(true);
      },
      (error) =>{
        this.isLoading = !this.isLoading;
        this.inspecaoService.showMessage("Ocorreu um erro!");
      }
    );    
  }

  selectionChange(event) : void {}

  createDropdownMonthYear() : void {
    var controlForMothnYear = true;
    var date = new Date();
    var currentYear = date.getFullYear();
    var months;
    months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    for (var i = 1; i == 1; i++) {
      for (const key in months) {
        if (months.hasOwnProperty(key)) {
          const element = months[key];
          this.dateMonthYear.push(`${element}-${(currentYear + i).toString().substring(2,4)}`);
        }
      }      
    }

    for (var i = 0; i <= 1; i++) {
      for (const key in months) {
        if (months.hasOwnProperty(key)) {
          const element = months[key];
          this.dateMonthYear.push(`${element}-${(currentYear - i).toString().substring(2,4)}`);
        }
      }      
    }
  }

  onNoClick(isReaload: boolean = false): void {
    this.dialogRef.close(isReaload);
  }

  public hasError = (field: string, errorName: string) => {
    return this.formInspecao.controls[field].hasError(errorName);
  };

  isFieldInvalid(field: string) {
    return (
      (!this.formInspecao.get(field).valid &&
        this.formInspecao.get(field).touched) ||
      (this.formInspecao.get(field).untouched && this.formSubmitAttempt)
    );
  }

}
