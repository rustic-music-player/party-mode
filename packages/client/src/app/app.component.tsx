import React from 'react';
import Party from './pages/party/party';
import { useService } from '../commons/use-service.hook';
import { PlayerState } from './state/player.state';
import { PartyState } from './state/party.state';
import LandingPage from './pages/landing/landing';

const App = () => {
  const playerState = useService(PlayerState);
  const partyState = useService(PartyState);

  if (partyState.partyCode == null) {
    return <LandingPage joinParty={code => partyState.joinParty(code)} />
  }
  return <Party playerState={playerState}/>;
};

export default App;
