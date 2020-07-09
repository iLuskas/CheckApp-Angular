import { Component, OnInit, Input } from '@angular/core';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EquipamentoSegurancaService } from 'src/app/services/EquipamentoSeguranca.service';
import { QrCodeReaderComponent } from '../../qr-code-reader/qr-code-reader.component';
import { InspecaoEquipamentoComponent } from '../../inspecao/inspecao-detalhe/inspecao-equipamento/inspecao-equipamento.component';
import { ManutencaoEquipamentoComponent } from './manutencao-equipamento/manutencao-equipamento.component';
import { ManutencaoEstadoService } from '../manutencao-estado.service';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-detalhe-manutencao',
  templateUrl: './detalhe-manutencao.component.html',
  styleUrls: ['./detalhe-manutencao.component.css']
})
export class DetalheManutencaoComponent implements OnInit {
  @Input() agendamentoId: any
  agendamentoSeleted: any;
  isFinishInspetion: boolean;
  isLoading: boolean;
  date = new Date();
  usuarioAtual: Usuario;
  ageId: number;
  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private equipamentoService: EquipamentoSegurancaService,
    private estadoManutencao: ManutencaoEstadoService) {
      this.estadoManutencao.isManutentionDone.subscribe((value) => {
        if (value)
          this.agendamentoSeleted = JSON.parse(
            localStorage.getItem("AgendaSeleted")
          );
      });
  
      this.estadoManutencao.isAllManutentionDone.subscribe((value) => {
        this.isFinishInspetion = value;
      });

  }

  ngOnInit(): void {
    this.usuarioAtual = JSON.parse(localStorage.getItem("cacheUsuario"));
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.ageId = !this.agendamentoId ? this.agendamentoSeleted.ageId : this.agendamentoId;
  }

  finalizarAgendamento() {
    this.agendamentoService.finalizaAgendamentoById(this.ageId.toString()).subscribe(
      () => {
        localStorage.removeItem("AgendaSeleted");
        this.router.navigate(["/manutencoes"], { relativeTo: this.route });
        this.agendamentoService.showMessage('Manutenção finalizada.');
      },
      (error) =>{
        this.agendamentoService.erroHandler(error);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(QrCodeReaderComponent, {
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        var equipamento = JSON.parse(result);
         this.getEquipByNumExtintor(equipamento);
      }
    });
  }

  getEquipByNumExtintor(equipamento: any) : void {
    this.equipamentoService.getEquipByNumExtintor(equipamento.num_ext.toString(), this.agendamentoSeleted.empId).subscribe
    ((extintor) =>{
      if(extintor)
        this.openDialogInspecao(extintor);
      else
        this.equipamentoService.showMessage("Equipamento não foi encontrato.😓", true);
    });
  }

  openDialogInspecao(extintor : any): void {
    const dialogRef = this.dialog.open(ManutencaoEquipamentoComponent, {
      data: {equip: extintor, dataIncial: this.date},
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        if(!this.agendamentoId){
          this.agendamentoSeleted.qtdInsp++;
          this.agendamentoSeleted.qtdNotInsp--;
          localStorage.setItem("AgendaSeleted", JSON.stringify(this.agendamentoSeleted));
        }
        this.estadoManutencao.isManutentionDone.next(true);
      }
    });
  }

}
