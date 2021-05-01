export class ClientJoinedServerEvent {
  constructor(public clientId: string, public serverCode: string) {
  }
}
