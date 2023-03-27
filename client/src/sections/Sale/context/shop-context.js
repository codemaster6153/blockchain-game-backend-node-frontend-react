import * as React from 'react'

const ShopContext = React.createContext()

function ShopProvider({ value, children }) {
    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

function useShop() {
    const context = React.useContext(ShopContext)
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider')
    }
    return context
}

export { ShopProvider, useShop }