import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, DateSelectArg, EventAddArg, EventApi, EventChangeArg, EventClickArg, EventRemoveArg } from '@fullcalendar/angular'; // useful for typechecking
import { DateClickArg } from '@fullcalendar/interaction';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DeleteDialogComponent } from './dialog/delete-dialog/delete-dialog.component';
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component';
import { TitleDialogComponent } from './dialog/title-dialog/title-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title: any;

    // doc do modal ngxSmartModalService: https://maximelafarie.com/ngx-smart-modal/#/api
    constructor(public ngxSmartModalService: NgxSmartModalService, public dialog: MatDialog) {
    }

    // Link usado como base para criar as configs do FullCalendar: https://fullcalendar.io/docs#toc
    calendarOptions: CalendarOptions = {
        initialView: 'timeGridWeek', // Definindo a visão principal na tela para mostrar a visão do mês com os dias
        locale: 'pt-br', // Definindo que a localização é brasileira
        headerToolbar: { // Definindo como será mostrados os elementos no cabeçalho do calendario
            left: 'prev,next today', // Na esqueda temos os botões de anterior, proximo e hoje
            center: 'title', // No centro vai mostrar o dia, mes e ano
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // Na direito mostra os botões para mudar a visualização para dias da semana e o dia atual
        },
        buttonText: { // Muda o texto dos botões do cabeçalho
            today: 'Hoje',
            month: "Mês",
            day: 'Dia',
            week: 'Semana',
            prev: 'Passado',
            next: 'Próximo'
        },
        //themeSystem: 'bootstrap5', // Alterando o tema padrão para usar o bootsrtap v5
        //dateClick: this.hamdleDateClick.bind(this), // É chamado somente quando clicamos na data na visão mês, semana ou dia. Mesma coisa do evento select
        allDaySlot: true, // Nas visualizações de semana e dia, mostra um parte para conter os eventos que são o dia todo
        allDayText: 'Dia todo', // Altera o texto do allDaySlot
        weekends: false, // Não mostra os dias de final de semana
        handleWindowResize: true, // Se o calendário deve ser redimensionado automaticamente quando a janela do navegador for redimensionada
        nowIndicator: true, // Mostra uma setinha vermelha indicando o tempo atual
        editable: true, // Determina se podemos arrastar e mudar o tamanho do evento
        selectable: true, // Permite selecionar vários dias ou intervalo de tempo
        selectMirror: true, // Mostra no calendario o tamanho do evento que está sendo selecionado enquanto o usuário está arrastando o que deseja. Usando na visão que contém horas
        dayMaxEvents: true, // Limita a quantidade de eventos que são mostradas no dia para que repeite o tamanho pré determinado do elemento na tela mostra uns 4 quatro e abaixo um link com a quantidade excedente e ao clicar mostra todos os eventos. Se não estiver ativada, mostra todos e vai aumentando o tamanho do elemento
        select: this.handleDateSelect.bind(this), // Usado para adicionar um novo evento no calendario ao clicar no dia ou hora
        eventClick: this.handleEventClick.bind(this), // Usado para mostrar os datalhes do evento ao clicar no evento
        eventAdd: this.onSubmit.bind(this), // É chamado após o evento ser adicionado ao calendario. Para salvar no banco de dados
        eventChange: this.onChange.bind(this), // É chamado após o evento ser alterado quando é arrastado ou aumenta o tamanho. Para salvar no banco de dados
        eventRemove: this.onRemove.bind(this), // É chamado após o evento ser removido do calendário. Para excluir do banco de dados
        eventsSet: this.handleEvents.bind(this), // Usado sempre após qualquer operação. Seja adicionar ou remover ou ao iniciar ocalendario
        events: [ // Aqui é usado para mostrar como funciona a recorrência de compromissos
            // {
            //     groupId: 'blueEvents', // Eventos recorrentes que possuem groupId, quando alterados, todos são alterados
            //     daysOfWeek: ['4'],
            //     startTime: '10:45:00',
            //     endTime: '12:45:00'
            // },
            // {
            //     daysOfWeek: ['3'], // Como não tem groupId, somente um evento é alterado
            //     startTime: '11:00:00',
            //     endTime: '11:30:00',
            //     color: 'red'
            // },
            { 
                id: 'teste',
                title: 'Teste preto',
                daysOfWeek: ['3'], // Como não tem groupId não somente esse é alterado com título
                startRecur: '2022-10-06', // Aqui vale um detalhe. 
                endRecur: '2022-10-21',// Aqui deve ser informada uma data com 1 dia mais. Pois se não colocar, ele conta a data que está colocada aqui e não mostra na recorrência
                startTime: '11:00:00',
                endTime: '11:30:00',
                color: '#E3FF33', // O color aqui é um alias para backGround e border color. Ou seja, na visão dia e semana, a linha fica toda preenchida. No mês muda a cor da bolinha
                textColor: '#FF8633' // Muda a cor do texto
            },
            { // Mostrando que funciona com todos os campos juntos
                daysOfWeek: ["3"], // Como não tem groupId não somente esse é alterado com título
                startRecur: '2022-07-06', // Aqui vale um detalhe. 
                endRecur: '2022-07-21',// Aqui deve ser informada uma data com 1 dia mais. Pois se não colocar, ele conta a data que está colocada aqui e não mostra na recorrência
                startTime: '11:00:00',
                endTime: '11:30:00',
                color: 'black',
                title: 'Teste verde aspas duplas',
                start: '2022-07-06', // a property!
                end: '2022-07-06' // a property! ** see important note below about 'end' **
            },
            { // this object will be "parsed" into an Event Object
                title: 'The Title', // a property!
                start: '2022-06-27T15:00:00', // a property!
                end: '2022-06-27T15:40:00' // a property! ** see important note below about 'end' **
            }
        ]
        // eventSources: [// Forma de chamar várias apis para pegar compromissos
        // ]
        //events: { // Aqui é usado pra mostrar como fazer a integração do full calendar com uma API
        //    url: 'suaUrl', // O retorno da API deve estar compatível com a documentação
        //    failure: this.showErrorDialog.bind(this) // O link da documentação é: https://fullcalendar.io/docs/events-json-feed
        // }
    };

    // Aqui é usado quando clicamos no espaço do evento no calendário. Nesse caso, para excluir o evento
    handleEventClick(clickInfo: EventClickArg) {
        // Rotina abaixo usada exclusivamente quando usamos o ngxSmartModalService
        // abre o modal na tela
        //this.ngxSmartModalService.getModal('myModalDelete').open();
        // seta o valor de selectInfo no modal para que possamos salvar o evento após clicar em salvar no modal
        //this.ngxSmartModalService.setModalData(clickInfo, 'myModalDelete');

        // Rotina abaixo usada exclusivamente quando usamos o MatDialog do material angular
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '250px',
            data: { date: clickInfo.event.startStr }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                clickInfo.event.remove();
            }
        });
    }

    // Aqui é usando quando clicamos no quadrado do dia ou arrastamos na visão de semana ou dia o tempo para criar um novo evento
    handleDateSelect(selectInfo: DateSelectArg) {
        // Rotina abaixo usada exclusivamente quando usamos o ngxSmartModalService
        // abre o modal na tela
        //this.ngxSmartModalService.getModal('myModal').open();
        // seta o valor de selectInfo no modal para que possamos salvar o evento após clicar em salvar no modal
        //this.ngxSmartModalService.setModalData(selectInfo, 'myModal');

        // Rotina abaixo usada exclusivamente quando usamos o MatDialog do material angular
        const dialogRef = this.dialog.open(TitleDialogComponent, {
            width: '250px',
            data: { date: selectInfo.startStr }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const calendarApi = selectInfo.view.calendar;

                calendarApi.unselect(); // clear date selection

                // Link usado como base: https://stackoverflow.com/a/8831937
                // Criação de um hash para criar a identificação do evento na api do FullCalendar
                let hash = 0;
                for (let i = 0, len = result.length; i < len; i++) {
                    let chr = result.charCodeAt(i);
                    hash = (hash << 5) - hash + chr;
                    hash |= 0; // Convert to 32bit integer
                }

                calendarApi.addEvent({
                    id: hash.toString(),
                    title: result,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay
                });
            }
        });
    }

    // Aqui é usando quando clicamos no quadrado do dia ou arrastamos na visão de semana ou dia o tempo para criar um novo evento
    hamdleDateClick(selectInfo: DateClickArg) {
        this.ngxSmartModalService.getModal('myModal').open();
    }

    // Aqui usamos para ao adicionar o evento no calendário, chamar uma api externa para salvar no banco de dados
    onSubmit(event: EventAddArg) {
        console.log('Salvar no banco de dados', event.event.title);
        // Rotina abaixo usada exlusivamente para quando usamos o ngxSmartModalService
        //this.ngxSmartModalService.resetModalData('myModal');
        //this.title = '';
        //this.ngxSmartModalService.getModal('myModal').close();
    }

    // Aqui usamos para editar o evento no calendário quando arrastamos o evento no caalendário, chamar uma api externa para salvar no banco de dados
    onChange(event: EventChangeArg) {
        console.log('Alterar no banco de dados', event.event.title);
    }

    // Aqui usamos ao clicar no evento para remover o evento do banco de dados
    onRemove(event: EventRemoveArg) {
        console.log('Excluir no banco de dados', event.event.title);
    }

    // Aqui é chamado sempre quando inicia o calendário ou quando faz alguma das ações acima
    handleEvents(events: EventApi[]) {
        console.log(events);
    }

    // Aqui salva o evento após abrir o modal usando o ngxSmartModalService
    saveEvent(value: NgForm) {
        // console.log(value); mostra tudo que vem no ngForm
        // console.log(value.form.value); mostra o valor do campo em json
        // console.log(value.controls.title.value); mostra realmente o valor que tem dentro do campo title

        var selectInfo = this.ngxSmartModalService.getModalData('myModal');
        this.title = value.controls.title.value;

        if (selectInfo) {
            const calendarApi = selectInfo.view.calendar;

            calendarApi.unselect(); // clear date selection

            calendarApi.addEvent({
                id: '1',
                title: this.title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            });
        }
    }

    // Aqui abre o modal do ngxSmartModalService para realizar a exclusão do compromisso
    deleteEvent(canDelete: boolean) {
        if (canDelete) {
            var clickInfo = this.ngxSmartModalService.getModalData('myModalDelete');
            clickInfo.event.remove();

            this.ngxSmartModalService.resetModalData('myModalDelete');
            this.ngxSmartModalService.getModal('myModalDelete').close();
        }
        else {
            this.ngxSmartModalService.resetModalData('myModalDelete');
            this.ngxSmartModalService.getModal('myModalDelete').close();
        }
    }

    // Aqui é quando ocorre erro ao buscar compromissos da API
    showErrorDialog() {
        // Rotina abaixo usada exclusivamente quando usamos o MatDialog do material angular
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '350px'
        });

        dialogRef.afterClosed().subscribe(result => { });
    }
}
