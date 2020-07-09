import { Component, OnInit } from "@angular/core";
import { EquipamentoSegurancaService } from 'src/app/services/EquipamentoSeguranca.service';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';

@Component({
  selector: "app-home-dashboard-layout",
  templateUrl: "./home-dashboard-layout.component.html",
  styleUrls: ["./home-dashboard-layout.component.css"],
})
export class HomeDashboardLayoutComponent implements OnInit {
  dateMonthYear: { id: number; date: string }[] = [];
  relatEquipamentoInsp: any[];
  dataFormatadaInsp: {data: any[], label: string}[] =[];
  relatEquipamentoNotInsp: any[];
  dataFormatadaNotInsp: {data: any[], label: string}[] =[];
  relatEquipamentoOcorrenciaEmp: any[];
  dataFormatadaOcorrenciaEmp: {data: any[], label: string}[] =[];

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

    public barChartLabels = [];
    public barChartType = 'bar';
    public barChartLegend = true;
    public barChartData = [
      {data: [0], label:''}
    ];

    public barChartDataNotInsp = [
      {data: [0], label:''}
    ];

    public barChartDataOcorrenciaEmp = [
      {data: [0], label:''}
    ];

  constructor(
    private equipamentoService: EquipamentoSegurancaService,
    private empresaService: EmpresaClienteService
  ) {

  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.getRelatInsp();
    this.getRelatNotInsp();
    this.getOcorrenciaEmpresa();
    this.createDropdownMonthYear();
  }

  getRelatInsp(): void {
    this.equipamentoService.getRelatEquipInsp().subscribe
    ((relatEquipInsp: any[]) => {      
      this.relatEquipamentoInsp = relatEquipInsp;
      this.relatEquipamentoInsp.forEach(relat => 
        this.dataFormatadaInsp.push({
          data: [relat.janeiro, relat.fevereiro, relat.marco, relat.abril, relat.maio , relat.junho, relat.julho],
          label: relat.empresa
        })
      );
      this.barChartData = this.dataFormatadaInsp;
    });
  }

  getRelatNotInsp() : void {
    this.equipamentoService.getRelatEquipNotInsp().subscribe
    ((relatEquipNotInsp: any[]) => {      
      this.relatEquipamentoNotInsp = relatEquipNotInsp;
      
      this.relatEquipamentoNotInsp.forEach(relat => 
        this.dataFormatadaNotInsp.push({
          data: [relat.janeiro, relat.fevereiro, relat.marco, relat.abril, relat.maio , relat.junho, relat.julho],
          label: relat.empresa
        })
      );
      this.barChartDataNotInsp = this.dataFormatadaNotInsp;
    });
  }

  getOcorrenciaEmpresa() : void {
    this.empresaService.getRelatOcorrenciaForEmp().subscribe
    ((relatOcorrenciaEmp: any[]) => {
      this.relatEquipamentoOcorrenciaEmp = relatOcorrenciaEmp;
      
      this.relatEquipamentoOcorrenciaEmp.forEach(relat => 
        this.dataFormatadaOcorrenciaEmp.push({
          data: [relat.janeiro, relat.fevereiro, relat.marco, relat.abril, relat.maio , relat.junho, relat.julho],
          label: relat.empresa
        })
      );
      this.barChartDataOcorrenciaEmp = this.dataFormatadaOcorrenciaEmp;
    })
  }

  createDropdownMonthYear(): void {
    var date = new Date();
    let id: number = 0;
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth();
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
    for (var i = 0; i <= 0; i++) {
      for (const key in months) {
        if (months.hasOwnProperty(key)) {
          if(id > currentMonth) break;

          const element = months[key];
          this.dateMonthYear.push({
            id: id++,
            date: `${element}-${(currentYear).toString().substring(2, 4)}`,
          });
        }
      }
    }
    
    this.dateMonthYear.forEach(date => this.barChartLabels.push(date.date));
  }

}
