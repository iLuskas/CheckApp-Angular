import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { EmpresaClienteDTO } from 'src/app/models/EmpresaClienteDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';

@Component({
  selector: 'app-empresa-delete',
  templateUrl: './empresa-delete.component.html',
  styleUrls: ['./empresa-delete.component.css']
})
export class EmpresaDeleteComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  formDelete: FormGroup;
  empresa: EmpresaClienteDTO;
  telefones: FormArray;
  enderecos: FormArray;
  private formSubmitAttempt: boolean;

  get enderecoDTOsArray() {
    return (<FormArray>this.formDelete.get("enderecoDTOs")).controls;
  }

  get telefoneDTOsArray() {
    return (<FormArray>this.formDelete.get("telefoneDTOs")).controls;
  }

  constructor(
    private empresaService: EmpresaClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getempresaById();
    this.criaformDelete();

    this.enderecos = <FormArray>this.formDelete.get("enderecoDTOs");
    this.telefones = <FormArray>this.formDelete.get("telefoneDTOs");
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

  criaformDelete() {
    this.formDelete = this.fb.group({
      id: [null],
      razaoSocial: [{value: null, disabled: true}],
      cnpj: [{value: null, disabled: true}],
      inscricao_estadual: [{value: null, disabled: true}],
      enderecoDTOs: this.fb.array([this.criaFormGroupEndereco()]),
      telefoneDTOs: this.fb.array([this.criaFormGroupTelefone()]),
    });
  }

  createEmpresa(): void {
    this.empresa = this.formDelete.value;
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
        this.formDelete.patchValue(empresa);
        console.log(this.formDelete.value);
        console.log(this.empresa);
      });
  }

  deleteEmpresa(): void {
    this.empresaService.deleteEmpresaCliente(this.empresa).subscribe(() => {
      this.empresaService.showMessage("Empresa deletada com sucesso!");
      this.router.navigate(["/empresas"]);
    });
  }

  cancelar(): void {
    this.router.navigate(["/empresas"]);
  }

}
