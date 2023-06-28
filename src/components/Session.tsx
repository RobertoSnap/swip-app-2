import '@walletconnect/react-native-compat';
import type {SignClient} from '@walletconnect/sign-client/dist/types/client';
import {SessionTypes} from '@walletconnect/types';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';

interface Props {
  signClient: SignClient;
}

export default function Session({signClient}: Props) {
  const [sessions /*, _setSessions */] = useState<SessionTypes.Struct[]>(() =>
    signClient.session.getAll(),
  );

  useEffect(() => {
    console.log('sessions', sessions);
  }, [sessions]);

  const renderItem = ({item}: {item: SessionTypes.Struct}) => (
    <View>
      <Text>Topic: {item.topic}</Text>
      <Text>Pairing Topic: {item.pairingTopic}</Text>
      <Text>Controller: {item.controller}</Text>
      <Text>Session Properties: {JSON.stringify(item.sessionProperties)}</Text>
      <Text>Self Public Key: {item.self.publicKey}</Text>
      <Text>Peer Public Key: {item.peer.publicKey}</Text>
    </View>
  );

  return (
    <>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
}
