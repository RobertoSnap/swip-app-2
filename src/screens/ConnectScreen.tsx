import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import '@walletconnect/react-native-compat';
import SignClient  from '@walletconnect/sign-client';
import { Button, Text, View } from 'react-native';

import Connect from '../components/Connect';
import { createWalletConnectClient } from '../utils/wallet-connect-utils';
// import Session from '../components/Session';

export default function ConnectScreen() {
  const [signClient, setSignClient] = useState<SignClient>();



  useEffect(() => {
    let subscribed = true
    const doAsync = async () => {
      console.log("auto connect")
      if(!Constants.expoConfig?.extra?.WALLET_CONNECT_PROJECT_ID){
        throw Error('No WALLET_CONNECT_PROJECT_ID in app.json')
      }
      if(!Constants.expoConfig?.extra?.WALLET_CONNECT_RELAY_URL){
        throw Error('No WALLET_CONNECT_RELAY_URL in app.json')
      }
      const client = await createWalletConnectClient()
      if (subscribed) {
        setSignClient(client)
      }
    };
    doAsync();
    return () => { subscribed = false }
  }, [])

  const connect = async () => {
    console.log("connect")
    if(!Constants.expoConfig?.extra?.WALLET_CONNECT_PROJECT_ID){
      throw Error('No WALLET_CONNECT_PROJECT_ID in app.json')
    }
    if(!Constants.expoConfig?.extra?.WALLET_CONNECT_RELAY_URL){
      throw Error('No WALLET_CONNECT_RELAY_URL in app.json')
    }
    const client = await createWalletConnectClient();
    setSignClient(client)
  }


  return (
    <View >
      <Text>WalletConnect</Text>
      <Text>Connection ok: {signClient ? 'true' : 'false'} </Text>

      <Button
        title={!signClient ? 'Initialize' : 'Initialized'}
        onPress={() => connect()}
      />
      {signClient && <Connect signClient={signClient} />}
      {/* {signClient && <Session signClient={signClient} />}r */}
    </View>
  );
}