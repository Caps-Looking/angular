import { Component, OnInit } from '@angular/core';

import { Contato } from './contato.model';
import { ContatoService } from './contato.service';
import { DialogService } from './../dialog.service';

@Component({
    moduleId: module.id,
    selector: 'contatos-lista',
    templateUrl: 'contatos-lista.component.html'
})
export class ContatosListaComponent implements OnInit {
    contatos: Contato[] = []
    menssagem: {}
    classesCss: {}
    private currentTimeout: any
    
    constructor(
        private contatoService: ContatoService,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.contatoService.findAll()
            .then((contatos: Contato[])=>{
                this.contatos = contatos;
            }).catch(err =>{
                this.mostrarMenssagem({tipo: 'danger', texto: 'Ocorreu um erro ao buscar a lista de contatos!!'})
            })
    }
    
    onDelete(contato: Contato): void {
        this.dialogService.confirm('Deseja deletar o contato ' + contato.nome + '?')
            .then((canDelete: boolean)=> {
                if(canDelete) {
                    this.contatoService.delete(contato)
                        .then(()=>{
                            this.contatos = this.contatos.filter((c: Contato) => c.id != contato.id)
                            this.mostrarMenssagem({tipo: 'success', texto: 'Contato Deletado!'})
                        })
                        .catch(err => {
                            console.log(err)
                            this.mostrarMenssagem({tipo: 'danger', texto: 'Ocorreu um erro ao deletar um contato!'})
                        })
                }
            })
    }

    private mostrarMenssagem(menssagem: {tipo: string, texto: string}): void {
        this.menssagem = menssagem
        this.montarClasses(menssagem.tipo)
        if(menssagem.tipo != 'danger'){
            if (this.currentTimeout){
                clearTimeout(this.currentTimeout)
            }
            this.currentTimeout = setTimeout(() => this.menssagem = undefined, 3000)
        }
    }

    private montarClasses(tipo: string): void {
        this.classesCss = {
            'alert': true            
        }
        this.classesCss['alert-' + tipo] = true
    }
}