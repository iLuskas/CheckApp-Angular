import { Component, OnInit, Inject, ViewChild, NgZone } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { take } from "rxjs/operators";
import { InspecaoService } from "src/app/services/Inspecao.service";
import { InspecaoDTO } from "src/app/models/InspecaoDTO";
import { exit, abort } from "process";

@Component({
  selector: "app-inspecao-equipamento",
  templateUrl: "./inspecao-equipamento.component.html",
  styleUrls: ["./inspecao-equipamento.component.css"],
})
export class InspecaoEquipamentoComponent implements OnInit {
  formInspecao: FormGroup;
  inspecao: InspecaoDTO;
  date = new FormControl(new Date());
  dateMonthYear: { id: number; date: string }[] = [];
  agendamentoSeleted: any;
  usuarioAtual: any;
  precisaManutencao: boolean;
  opcoesInspecao: { opcao: string; value: string }[] = [
    { opcao: "Conforme", value: "C" },
    { opcao: "Não Conforme", value: "NC" },
    { opcao: "Não Aplicável", value: "NA" },
  ];
  isLoading: boolean;
  metodoApi = "postInspecao";
  file: File;
  imgPreview: any;
  @ViewChild("autosize") autosize: CdkTextareaAutosize;

  private formSubmitAttempt: boolean;

  constructor(
    public dialogRef: MatDialogRef<InspecaoEquipamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private inspecaoService: InspecaoService
  ) {}

  ngOnInit(): void {
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.usuarioAtual = JSON.parse(localStorage.getItem("cacheUsuario"));
    this.createDropdownMonthYear();

    if (this.data.inspecao) {
      this.montaInfoInspecao();
    } else {
      this.createFormInpecao();
    }
  }

  montaInfoInspecao() {
    this.metodoApi = "putInspecao";
    this.formInspecao = this.fb.group({
      id: [this.data.inspecao.id],
      statusInspManutId: [this.data.inspecao.statusInspManutId],
      funcionarioId: [this.data.inspecao.funcionarioId],
      empresaClienteId: [this.data.inspecao.empresaClienteId],
      agendaInspManutId: [this.data.inspecao.agendaInspManutId],
      equipamentoSegurancaId: [this.data.inspecao.equipamentoSegurancaId],
      ultimaRec_Insp: [
        this.data.inspecao.ultimaRec_Insp,
        Validators.compose([Validators.required]),
      ],
      proximoRec_Insp: [
        this.data.inspecao.proximoRec_Insp,
        Validators.compose([Validators.required]),
      ],
      ultimoReteste_Insp: [
        this.data.inspecao.ultimoReteste_Insp,
        Validators.compose([Validators.required]),
      ],
      proximoReteste_Insp: [
        this.data.inspecao.proximoReteste_Insp,
        Validators.compose([Validators.required]),
      ],
      estadoCilindro_Insp: [
        this.data.inspecao.estadoCilindro_Insp,
        Validators.compose([Validators.required]),
      ],
      estadoLocal_Insp: [
        this.data.inspecao.estadoLocal_Insp,
        Validators.compose([Validators.required]),
      ],
      seloLacre_insp: [
        this.data.inspecao.seloLacre_insp,
        Validators.compose([Validators.required]),
      ],
      sinalizacaoPiso_insp: [
        this.data.inspecao.sinalizacaoPiso_insp,
        Validators.compose([Validators.required]),
      ],
      sinalizacaoAcesso_insp: [
        this.data.inspecao.sinalizacaoAcesso_insp,
        Validators.compose([Validators.required]),
      ],
      obs_Insp: [
        this.data.inspecao.obs_Insp,
        Validators.compose([Validators.required]),
      ],
      dataInicial: [this.data.dataIncial],
      dataFinal: [this.data.inspecao.dataFinal],
      duracao: [this.data.inspecao.duracao],
      precisaManutencao: [this.data.inspecao.precisaManutencao],
      imagemOcorrencia: [this.data.inspecao.imagemOcorrencia],
    });

    if(this.data.inspecao.imagemOcorrenciaBase64)
      this.getImagemFromBase64(this.data.inspecao.imagemOcorrenciaBase64);  

  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  createFormInpecao(): void {
    console.log(this.data.equip.ultManutencao);
    this.formInspecao = this.fb.group({
      id: [""],
      statusInspManutId: [3],
      funcionarioId: [this.agendamentoSeleted.funcId],
      empresaClienteId: [this.agendamentoSeleted.empId],
      agendaInspManutId: [this.agendamentoSeleted.ageId],
      equipamentoSegurancaId: [this.data.equip.equipamentoId],
      ultimaRec_Insp: [this.data.equip.ultManutencao ? this.data.equip.ultManutencao.dataRecarga : "", Validators.compose([Validators.required])],
      proximoRec_Insp: [this.data.equip.ultManutencao ? this.data.equip.ultManutencao.dataProximaRecarga : "", Validators.compose([Validators.required])],
      ultimoReteste_Insp: [this.data.equip.ultManutencao ? this.data.equip.ultManutencao.ultimoTeste : "", Validators.compose([Validators.required])],
      proximoReteste_Insp: [this.data.equip.ultManutencao ? this.data.equip.ultManutencao.dataReteste : "", Validators.compose([Validators.required])],
      estadoCilindro_Insp: ["", Validators.compose([Validators.required])],
      estadoLocal_Insp: ["", Validators.compose([Validators.required])],
      seloLacre_insp: ["", Validators.compose([Validators.required])],
      sinalizacaoPiso_insp: ["", Validators.compose([Validators.required])],
      sinalizacaoAcesso_insp: ["", Validators.compose([Validators.required])],
      obs_Insp: ["", Validators.compose([Validators.required])],
      dataInicial: [this.data.dataIncial],
      dataFinal: [""],
      duracao: [""],
      imagemOcorrencia: [""],
      precisaManutencao: [false]
    });

    // this.formInspecao.valueChanges.subscribe(data => console.log('form changes', data));
  }

  salvarInspecao(): void {
    if (
      this.usuarioAtual.perfil === "Inspetor" &&
      this.metodoApi === "putInspecao"
    ) {
      this.inspecaoService.showMessage(
        "Somente adminsitradores podem alterar a inspeção",
        true
      );
      return;
    }

    if (this.metodoApi !== "putInspecao")
      this.formInspecao.controls.dataFinal.patchValue(this.date.value);
      
    this.inspecao = this.formInspecao.value;
    this.isLoading = !this.isLoading;
    this.uploadImage(); 
    this.inspecaoService[this.metodoApi](this.inspecao).subscribe(
      () => {
        this.isLoading = !this.isLoading;
        this.inspecaoService.showMessage(
          "Equipamento inspecionado com sucesso!"
        );
        this.onNoClick(true);
      },
      (error) => {
        this.isLoading = !this.isLoading;
        this.inspecaoService.showMessage("Ocorreu um erro!");
      }
    );
  }

  SelectionDtRecargaChange(event): void {
    const MESES_EM_1_ANOS = 12;
    var index = this.dateMonthYear.find((data) => data.date === event).id;
    this.formInspecao.controls.proximoRec_Insp.setValue(
      this.dateMonthYear[index + MESES_EM_1_ANOS].date
    );
  }

  selectionUltRetesteChange(event) : void {
    const MESES_EM_5_ANOS = 60;
    var index = this.dateMonthYear.find((data) => data.date === event).id;
    this.formInspecao.controls.proximoReteste_Insp.setValue(
      this.dateMonthYear[index + MESES_EM_5_ANOS].date
    );
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

  onFileChange(event): void {
    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgPreview = reader.result;
    };

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      
      this.formInspecao.controls.imagemOcorrencia.setValue(this.file[0].name);
    }
  }

  uploadImage() {
    if(this.file)
      this.inspecaoService.postUpload(this.file).subscribe();
  }

  getImagemFromBase64(any) {
    this.imgPreview = "data:image/png;base64," + any;
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
