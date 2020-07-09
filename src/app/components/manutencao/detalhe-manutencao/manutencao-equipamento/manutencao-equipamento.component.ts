import { Component, OnInit, ViewChild, Inject, NgZone } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { take } from "rxjs/operators";
import { InspecaoDTO } from "src/app/models/InspecaoDTO";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { InspecaoService } from "src/app/services/Inspecao.service";
import { ManutencaoDTO } from "src/app/models/ManutencaoDTO";
import { ManutencaoService } from "src/app/services/manutencao.service";

@Component({
  selector: "app-manutencao-equipamento",
  templateUrl: "./manutencao-equipamento.component.html",
  styleUrls: ["./manutencao-equipamento.component.css"],
})
export class ManutencaoEquipamentoComponent implements OnInit {
  formManutencao: FormGroup;
  manutencao: ManutencaoDTO;
  date = new FormControl(new Date());
  dateMonthYear: { id: number; date: string }[] = [];
  tipoExtintor: {tipo: string; peso: string}[] = [
    {tipo: "ÁGUA", peso: "LT"},
    {tipo: "EM", peso: "LT"},
    {tipo: "CLA K", peso: "LT"},
    {tipo: "AMP CO2", peso: "KG"},
    {tipo: "AMP N2", peso: "KG"},
    {tipo: "FE36", peso: "KG"},
    {tipo: "CO2", peso: "KG"},
    {tipo: "PQS ABC", peso: "KG"},
    {tipo: "PQS BC", peso: "KG"},
    {tipo: "CLA D", peso: "KG"}
  ]
  agendamentoSeleted: any;
  usuarioAtual: any;
  isLoading: boolean;
  aprovado: boolean;
  reprovado: boolean;
  metodoApi = "postManutencao";
  pesoExtintor: string = "";

  @ViewChild("autosize") autosize: CdkTextareaAutosize;

  private formSubmitAttempt: boolean;

  constructor(
    public dialogRef: MatDialogRef<ManutencaoEquipamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private manutencaoService: ManutencaoService
  ) {}

  ngOnInit(): void {
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.usuarioAtual = JSON.parse(localStorage.getItem("cacheUsuario"));
    this.createDropdownMonthYear();

    if (this.data.manutencao) {
      this.montaInfoManutencao();
    } else {
      this.createFormInpecao();
    }
  }

  montaInfoManutencao() {
    this.metodoApi = "putManutencao";
    this.formManutencao = this.fb.group({
      id: [this.data.manutencao.id],
      statusInspManutId: [this.data.manutencao.statusInspManutId],
      funcionarioId: [this.data.manutencao.funcionarioId],
      empresaClienteId: [this.data.manutencao.empresaClienteId],
      agendaInspManutId: [this.data.manutencao.agendaInspManutId],
      equipamentoSegurancaId: [this.data.manutencao.equipamentoSegurancaId],
      tipoExt: [
        this.data.manutencao.tipoExt,
        Validators.compose([Validators.required]),
      ],
      capacidade: [
        this.data.manutencao.capacidade,
        Validators.compose([Validators.required]),
      ],
      anoFabricacao: [
        this.data.manutencao.anoFabricacao,
        Validators.compose([Validators.required]),
      ],
      fabricanteExt: [
        this.data.manutencao.fabricanteExt,
        Validators.compose([Validators.required]),
      ],
      ultimoTeste: [
        this.data.manutencao.ultimoTeste,
        Validators.compose([Validators.required]),
      ],
      numCilindro: [
        this.data.manutencao.numCilindro,
        Validators.compose([Validators.required]),
      ],
      seloInmetro: [
        this.data.manutencao.seloInmetro,
        Validators.compose([Validators.required]),
      ],
      obsManut: [
        this.data.manutencao.obsManut
      ],
      dataRecarga: [
        this.data.manutencao.dataRecarga,
        Validators.compose([Validators.required]),
      ],
      dataProximaRecarga: [this.data.manutencao.dataProximaRecarga, Validators.compose([Validators.required])],
      dataReteste: [
        this.data.manutencao.dataReteste,
        Validators.compose([Validators.required]),
      ],
      aprovado: [
        this.data.manutencao.aprovado,
        Validators.compose([Validators.required]),
      ],
      reprovado: [
        this.data.manutencao.reprovado,
        Validators.compose([Validators.required]),
      ],
      dataInicial: [this.data.dataIncial],
      dataFinal: [this.data.manutencao.dataFinal],
      duracao: [this.data.manutencao.duracao],
    });

    this.SelectionTipoChange(this.formManutencao.controls.tipoExt.value);
  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  createFormInpecao(): void {
    this.formManutencao = this.fb.group({
      id: [null],
      statusInspManutId: [3],
      funcionarioId: [this.agendamentoSeleted.funcId],
      empresaClienteId: [this.agendamentoSeleted.empId],
      agendaInspManutId: [this.agendamentoSeleted.ageId],
      equipamentoSegurancaId: [this.data.equip.equipamentoId],
      tipoExt: [
        this.data.equip.tipoExtintor,
        Validators.compose([Validators.required]),
      ],
      capacidade: [
        this.data.equip.capacidadeExtintor,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      anoFabricacao: [
        this.data.equip.anoFabricadoExtintor,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      fabricanteExt: [
        this.data.equip.fabricanteExtintor,
        Validators.compose([Validators.required]),
      ],
      ultimoTeste: ["", Validators.compose([Validators.required])],
      numCilindro: [
        this.data.equip.numeroExtintor,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      seloInmetro: [
        this.data.equip.seloInmetroExtintor,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      aprovado: [""],
      reprovado: [""],
      obsManut: [""],
      dataRecarga: ["", Validators.compose([Validators.required])],
      dataProximaRecarga: ["", Validators.compose([Validators.required])],
      dataReteste: ["", Validators.compose([Validators.required])],
      dataInicial: [this.data.dataIncial],
      dataFinal: [""],
      duracao: [""],
    });

    // this.formManutencao.valueChanges.subscribe(data => console.log('form changes', data));
  }

  salvarManutencao(): void {
    if (
      this.usuarioAtual.perfil === "Inspetor" &&
      this.metodoApi === "putManutencao"
    ) {
      this.manutencaoService.showMessage(
        "Somente adminsitradores podem alterar a manutenção",
        true
      );
      return;
    }

    if(this.validaChks()){
      this.manutencaoService.showMessage("Favor, sinalizar se o equipamento está Aprovado ou Reprovado.", true);
      return;
    }
      
    if (this.metodoApi !== "putManutencao")
      this.formManutencao.controls.dataFinal.patchValue(this.date.value);

    this.manutencao = this.formManutencao.value;
    this.isLoading = !this.isLoading;
    this.manutencaoService[this.metodoApi](this.manutencao).subscribe(
      () => {
        this.isLoading = !this.isLoading;
        this.manutencaoService.showMessage(
          "Equipamento Manutenido com sucesso!"
        );
        this.onNoClick(true);
      },
      (error) => {
        this.isLoading = !this.isLoading;
        this.manutencaoService.showMessage("Ocorreu um erro!");
      }
    );
  }

  selectionChangeUtmTeste(event): void {
    const MESES_EM_5_ANOS = 60;
    var index = this.dateMonthYear.find((data) => data.date === event).id;
    this.formManutencao.controls.dataReteste.setValue(
      this.dateMonthYear[index + MESES_EM_5_ANOS].date
    );
  }

  SelectionDtRecargaChange(event) : void {
    const MESES_EM_1_ANOS = 12;
    var index = this.dateMonthYear.find((data) => data.date === event).id;
    this.formManutencao.controls.dataProximaRecarga.setValue(
      this.dateMonthYear[index + MESES_EM_1_ANOS].date
    );
  }

  chkAprovadoChange(): void {
    if (this.formManutencao.controls.aprovado.value) {
      this.formManutencao.controls.reprovado.setValue(false);
      this.formManutencao.controls.obsManut.clearValidators();
      this.formManutencao.controls.obsManut.updateValueAndValidity();
    }
  }

  chkReprovadoChange(): void {
    if (this.formManutencao.controls.reprovado.value) {
      this.formManutencao.controls.aprovado.setValue(false);
      this.formManutencao.controls.obsManut.setValidators(Validators.compose([Validators.required]));
    } 
    else {
      this.formManutencao.controls.obsManut.clearValidators();
      this.formManutencao.controls.obsManut.updateValueAndValidity();
    }
  }

  validaChks() : boolean {
    return (!this.formManutencao.controls.aprovado.value && !this.formManutencao.controls.reprovado.value);
  }

  createDropdownMonthYear(): void {
    var date = new Date();
    let id: number = 0;
    var currentYear = date.getFullYear();
    var months;
    months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    for (var i = 5; i >= 0; i--) {
      for (const key in months) {
        if (months.hasOwnProperty(key)) {
          const element = months[key];
          this.dateMonthYear.push({
            id: id++,
            date: `${element}-${(currentYear - i).toString().substring(2, 4)}`,
          });
        }
      }
    }

    for (var i = 0; i <= 5; i++) {
      for (const key in months) {
        if (months.hasOwnProperty(key)) {
          const element = months[key];
          this.dateMonthYear.push({
            id: id++,
            date: `${element}-${(currentYear + i).toString().substring(2, 4)}`,
          });
        }
      }
    }
  }

  SelectionTipoChange(value) : void {
    this.pesoExtintor = this.tipoExtintor.find(tipo => tipo.tipo === value).peso;   
  }

  onNoClick(isReaload: boolean = false): void {
    this.dialogRef.close(isReaload);
  }

  public hasError = (field: string, errorName: string) => {
    return this.formManutencao.controls[field].hasError(errorName);
  };

  isFieldInvalid(field: string) {
    return (
      (!this.formManutencao.get(field).valid &&
        this.formManutencao.get(field).touched) ||
      (this.formManutencao.get(field).untouched && this.formSubmitAttempt)
    );
  }
}
