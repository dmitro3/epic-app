import React from 'react'

export type ProfileModalState =
  // | PolkadotConnectSteps
  | 'account'
  | 'linked-addresses'
  | 'profile-settings'
  // | 'polkadot-connect-unlink'
  // | 'polkadot-connect-identity-removed'
  | 'privacy-security'
  | 'private-key'
  | 'logout'
  | 'share-session'
  | 'about'
  | 'notifications'
  | 'telegram-notifications'
  | 'push-notifications'
  // | 'withdraw-tokens'
  | 'wallet-action-required'
  | 'loading-tx'
  | 'create-chat'
  | 'create-chat-loading'

export type ProfileModalContentProps = {
  address: string
  setCurrentState: (
    state: React.SetStateAction<ProfileModalState>,
    forceFlowBackTo?: ProfileModalState
  ) => void
  closeModal: () => void
}
