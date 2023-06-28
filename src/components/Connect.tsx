import React, {useCallback, useEffect, useState} from 'react';
import '@walletconnect/react-native-compat';
import {SignClient} from '@walletconnect/sign-client/dist/types/client';
import {ProposalTypes, SignClientTypes, Verify} from '@walletconnect/types';
import {Button, TextInput} from 'react-native';
import {useWallet} from '../state/wallet-connect-state';

const buttonStyle = {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  padding: 10,
};

type ApproveEvent = {
  verifyContext: Verify.Context;
} & Omit<SignClientTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>;

interface Props {
  signClient: SignClient;
}

export default function Connect({signClient}: Props) {
  const [connectionString, setConnectionString] = useState<string>();
  const {secret, createWallet, getWallet} = useWallet();

  const onSubmit = async () => {
    if (!connectionString) {
      throw Error('No connection string provided');
    }
    const res = await signClient.pair({uri: connectionString});
    console.log(res);
  };

  // create wallet if secret is undefined
  useEffect(() => {
    if (!secret) {
      createWallet();
    }
  }, [secret, createWallet]);

  const approveSession = useCallback(
    async (event: ApproveEvent) => {
      console.log('Start approve pairing, id: ', event.id);
      const wallet = getWallet()
      if (!wallet) {
        throw Error('No wallet found');
      }
      console.log("Found wallet", wallet.address)
      const {topic, acknowledged} = await signClient.approve({
        id: event.id,
        namespaces: {
          eip155: {
            accounts: [`eip155:5:${wallet.address}`],
            methods: ['personal_sign', 'eth_sendTransaction', 'request_credential'],
            events: ['accountsChanged'],
          },
        },
      });
      console.log('Session approved, topic:', topic);

      const session = await acknowledged();
      console.log('Session acknowledged, session:', session);
    },
    [signClient],
  );

  useEffect(() => {
    signClient.on('session_proposal', event => {
      console.log('TEST_EVENT received!', event);
      approveSession(event);
    });

    return () => {
      signClient.removeAllListeners('session_proposal');
    };
  }, [approveSession, signClient]);

  return (
    <>
      <TextInput
        value={connectionString}
        placeholder="Enter connection string"
        style={buttonStyle}
        onChangeText={text => setConnectionString(text)}
      />
      <Button title="Submit" onPress={onSubmit} />
    </>
  );
}
