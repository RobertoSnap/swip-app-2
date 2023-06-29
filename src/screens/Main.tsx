import React, { useEffect } from 'react';
import '@walletconnect/react-native-compat';
import { Button, Text, View } from 'react-native';

import Connect from '../components/Connect';
import { useWallet } from '../state/useWallet';



export default function Main() {
  const { init, ready, activeSession, client, handleApproveSession, handleSessionRequest } = useWallet()


  // listen to all wallet connect events
  useEffect(() => {
    if (!client) return
    client.on('session_proposal', handleApproveSession);
    client.on('session_request', handleSessionRequest);
    return () => {
      client.removeAllListeners('session_proposal');
      client.removeAllListeners('session_request');
    };
  }, [client]);

  // connect on mount
  useEffect(() => {
    init()
  }, []);

  // connect on button press
  const connect = async () => {
    init()
  }


  return (
    <View >
      <Text>WalletConnect</Text>
      <Text>WalletConnect ready: {ready ? 'Yes' : 'No'} </Text>
      <Text>Active session: {activeSession ? 'Yes' : 'No'} </Text>

      <Button
        title={!ready ? 'Initialize' : 'Initialized'}
        onPress={() => connect()}
      />
      {ready && !activeSession && <Connect />}
      {/* {ready && <Sessions />} */}

    </View>
  );
}