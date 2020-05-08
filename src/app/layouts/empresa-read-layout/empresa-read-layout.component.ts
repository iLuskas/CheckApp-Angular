import { Component, OnInit } from '@angular/core';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpresaClienteDTO } from 'src/app/models/EmpresaClienteDTO';

@Component({
  selector: 'app-empresa-read-layout',
  templateUrl: './empresa-read-layout.component.html',
  styleUrls: ['./empresa-read-layout.component.css']
})
export class EmpresaReadLayoutComponent implements OnInit {

  panelEndOpenState = false;
  panelTelOpenState = false;
  formRead: FormGroup;
  empresa: EmpresaClienteDTO;
  telefones: FormArray;
  enderecos: FormArray;
  private formSubmitAttempt: boolean;

  get enderecoDTOsArray() {
    return (<FormArray>this.formRead.get("enderecoDTOs")).controls;
  }

  get telefoneDTOsArray() {
    return (<FormArray>this.formRead.get("telefoneDTOs")).controls;
  }

  constructor(
    private empresaService: EmpresaClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getempresaById();
    this.criaformRead();

    this.enderecos = <FormArray>this.formRead.get("enderecoDTOs");
    this.telefones = <FormArray>this.formRead.get("telefoneDTOs");
  }

  criaFormGroupEndereco(): FormGroup {
    return this.fb.group({
      id: [null],
      pais_end: [{value: null, disabled: true}],
      estado_end: [{value: null, disabled: true}],
      cidade_end: [{value: null, disabled: true}],
      bairro_end: [{value: null, disabled: true}],
      rua_end: [{value: null, disabled: true}],
      numero_end: [{value: null, disabled: true}],
      cep_end: [{value: null, disabled: true}],
    });
  }

  criaFormGroupTelefone(): FormGroup {
    return this.fb.group({
      id: [null],
      ddd_tel: [{value: null, disabled: true}],
      telefone_tel: [{value: null, disabled: true}],
    });
  }

  criaformRead() {
    this.formRead = this.fb.group({
      id: [null],
      razaoSocial: [{value: null, disabled: true}],
      cnpj: [{value: null, disabled: true}],
      inscricao_estadual: [{value: null, disabled: true}],
      enderecoDTOs: this.fb.array([this.criaFormGroupEndereco()]),
      telefoneDTOs: this.fb.array([this.criaFormGroupTelefone()]),
    });
  }

  createEmpresa(): void {
    this.empresa = this.formRead.value;
    this.empresaService.postEmpresaCliente(this.empresa).subscribe(
      () => {
        this.empresaService.showMessage("Empresa criada com sucesso!");
        this.router.navigate(["/empresas"]);
    });
  }

  getempresaById() {
    const id = this.route.snapshot.paramMap.get("id");
    this.empresaService
      .getEmpresaClienteById(id)
      .subscribe((empresa: EmpresaClienteDTO) => {
        this.empresa = empresa;
        this.formRead.patchValue(empresa);
        console.log(this.formRead.value);
        console.log(this.empresa);
      });
  }
  cancelar(): void {
    this.router.navigate(["/empresas"]);
  }

}
