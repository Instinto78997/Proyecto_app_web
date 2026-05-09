import { Injectable, NgZone } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
    private readonly socket: Socket;
    private readonly socketUrl: string;

    constructor(private ngZone: NgZone) {
        this.socketUrl = environment.apiUrl.replace(/\/api$/, '');
        this.socket = io(this.socketUrl, {
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('[Socket.IO] conectado:', this.socket.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[Socket.IO] desconectado:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket.IO] error de conexion:', error.message);
        });
    }

    onNotification(): Observable<any> {
        return new Observable(observer => {
            const handleNotification = (data: any) => {
                this.ngZone.run(() => {
                    console.log('[Socket.IO] notificacion recibida:', data);
                    observer.next(data);
                });
            };

            this.socket.on('notification', handleNotification);
            this.socket.on('notificacion', handleNotification);

            return () => {
                this.socket.off('notification', handleNotification);
                this.socket.off('notificacion', handleNotification);
            };
        });
    }

    onConnectionState(): Observable<{ connected: boolean; id?: string; error?: string }> {
        return new Observable(observer => {
            const emitState = (state: { connected: boolean; id?: string; error?: string }) => {
                this.ngZone.run(() => observer.next(state));
            };

            const handleConnect = () => emitState({ connected: true, id: this.socket.id });
            const handleDisconnect = () => emitState({ connected: false });
            const handleConnectError = (error: Error) => emitState({ connected: false, error: error.message });

            if (this.socket.connected) {
                emitState({ connected: true, id: this.socket.id });
            } else {
                emitState({ connected: false });
            }

            this.socket.on('connect', handleConnect);
            this.socket.on('disconnect', handleDisconnect);
            this.socket.on('connect_error', handleConnectError);

            return () => {
                this.socket.off('connect', handleConnect);
                this.socket.off('disconnect', handleDisconnect);
                this.socket.off('connect_error', handleConnectError);
            };
        });
    }

    disconnect(): void{
        if (this.socket.connected || this.socket.active) {
            this.socket.disconnect();
        }
    }
}
