import {Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})

export class FriendsComponent implements OnInit, OnDestroy {

  cambios: any[] = []; //lista cambios recib
  socketConectado = false;
  socketId = '';
  socketError = '';
  
  private subscription!: Subscription; //suscrip a eventos del soket.io
  private connectionSubscription!: Subscription;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.connectionSubscription = this.socketService.onConnectionState().subscribe((state) => {
      this.socketConectado = state.connected;
      this.socketId = state.id || '';
      this.socketError = state.error || '';
    });

    //se surcribe a en tiempo real
    this.subscription = this.socketService.onNotification().subscribe((data) => {
      console.log('cambio recibido en la base de datos: ',data);

      if (data.operation === 'UPDATE') { //solo procesa los UPDATE
        this.agregarCambio(this.normalizarCambio(data));
      }
    });
  }

  agregarCambio(data: any): void { //Agregar cambios a la lista
    const cambio = {
      id: data.id || 'N/A',
      nombreAnterior: data.nombreAnterior || 'N/A',
      nombreNuevo: data.nombreNuevo || 'N/A',
      genero: data.genero || 'N/A',
      fechaHora: data.fechaHora || new Date().toLocaleString(),
      timestamp: data.timestamp || new Date().toISOString(),
      updatedAtDb: data.updatedAtDb || ''
    };

    if (this.yaExisteCambio(cambio)) {
      return;
    }

    this.cambios.unshift(cambio);

    if (this.cambios.length > 10) {
      this.cambios.pop();
    }
  }

  normalizarCambio(data: any): any {
    const registroActual = data.new_data || data.data || {};
    const registroAnterior = data.old_data || {};

    return {
      id: registroActual.id || registroAnterior.id || 'N/A',
      nombreAnterior: registroAnterior.name || 'No disponible',
      nombreNuevo: registroActual.name || 'No disponible',
      genero: registroActual.gender || registroAnterior.gender || 'N/A',
      fechaHora: new Date().toLocaleString(),
      timestamp: data.timestamp || new Date().toISOString(),
      updatedAtDb: registroActual.updated_at || registroAnterior.updated_at || ''
    };
  }

  yaExisteCambio(cambio: any): boolean {
    return this.cambios.some((item) =>
      item.id === cambio.id &&
      item.nombreAnterior === cambio.nombreAnterior &&
      item.nombreNuevo === cambio.nombreNuevo &&
      item.genero === cambio.genero &&
      item.updatedAtDb === cambio.updatedAtDb
    );
  }

  limpiarCambios(): void {  //limpia los datos
    this.cambios = [];
  }

  ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      if (this.connectionSubscription) {
        this.connectionSubscription.unsubscribe();
      }
  }
}
