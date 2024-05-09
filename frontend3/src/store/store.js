import { createContext, useState } from "react";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
  LOAD_PAYROLL_DATA: "LOAD_PAYROLL_DATA",
  SET_COLUMNS: "SET_COLUMNS",
}

function GlobalStoreContextProvider(props) {
  //react state that holds the store
  const [store, setStore] = useState({
    payrollData: [],
    columns: []
  });

  //reducer that sets the state of the current store
  const storeReducer = (action) => {
    const {type, payload} = action;
    switch(type) {
      case GlobalStoreActionType.LOAD_PAYROLL_DATA: {
        return setStore({
          payrollData: payload,
          columns: store.columns
        });
      }
      case GlobalStoreActionType.SET_COLUMNS: {
        return setStore({
          payrollData: store.payrollData,
          columns: payload
        });
      }
      default: 
        return store; 
    }
  }

  //functions that change the state of the current store
  store.setPayrollData = function(payrollData) {
    storeReducer({
      type: GlobalStoreActionType.LOAD_PAYROLL_DATA,
      payload: payrollData
    })
  }

  store.setColumns = function (columns) {
    storeReducer({
      type: GlobalStoreActionType.SET_COLUMNS,
      payload: columns
    })
  }

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
