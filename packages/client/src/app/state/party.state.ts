import { action, makeObservable, observable } from 'mobx';
import { PartyApi } from '../../api/party';
import { Singleton } from '../../commons/ioc-container';

@Singleton()
export class PartyState {
  @observable
  partyCode?: string;

  constructor(private partyApi: PartyApi) {
    makeObservable(this);
    this.partyApi.observeJoinedParty(event => this.setCode(event.code));
  }

  joinParty(code: string) {
    this.partyApi.joinParty(code);
  }

  @action
  private setCode(code: string) {
    this.partyCode = code;
  }
}
