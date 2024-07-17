import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import {
  SdkViewSectionAlignment,
  SdkViewSectionType,
  SdkViewType,
} from '@dynamic-labs/sdk-api'
import {
  DynamicContextProvider,
  getAuthToken,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core'

import React, { useCallback, useMemo } from 'react'
import { AuthContext } from './AuthContext'

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, handleLogOut, setShowAuthFlow, user } =
    useDynamicContext()

  const authenticatedUserId = useMemo(() => user?.userId ?? null, [user])

  const loginUser = useCallback(() => {
    if (isAuthenticated) return
    setShowAuthFlow(true)
  }, [isAuthenticated, setShowAuthFlow])

  return (
    <AuthContext.Provider
      value={{
        authenticated: isAuthenticated,
        getAuthToken,
        signOut: handleLogOut,
        loginUser,
        authenticatedUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const DynamicAuthProvider = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'b4730f8f-a22c-47a8-a405-2ca398741f9d',
        walletConnectors: [EthereumWalletConnectors],

        overrides: {
          views: [
            {
              type: SdkViewType.Login,
              sections: [
                {
                  type: SdkViewSectionType.Wallet,
                  numOfItemsToDisplay: 3,
                },
              ],
            },
          ],
        },
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </DynamicContextProvider>
  )
}
