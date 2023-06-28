import React from 'react';
import '@walletconnect/react-native-compat';
import { ethers } from 'ethers';
import { create, } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage"

interface State {
  secret: string | undefined;
  createWallet: () => void;
  getWallet: () => ethers.Wallet | undefined;
}

// export const useStore = create<State & Action>(persist(set => (
//     {
//         secret: '',
//         updateSecret: (secret) =>{
//             returnset({secret});
//         },
//     }
// ), {name: 'wallet-connect-state'}));

export const useWallet = create<State>()(
  persist(
    (set, get) => ({
      secret: undefined,
      getWallet: () => {
        const secret = get().secret;
        if (!secret) {
          return undefined;
        } else {
          return new ethers.Wallet(secret);
        }
      },
      createWallet: () => {
        const privateKey = ethers.Wallet.createRandom().privateKey;
        return set({ secret: privateKey });
      },
    }),
    {
      name: 'wallet-state', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default the 'localStorage' is used
      partialize: state => ({ secret: state.secret }),
    },
  ),
);
