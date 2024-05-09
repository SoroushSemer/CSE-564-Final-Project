import { createContext, useState } from "react";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
  LOAD_PAYROLL_DATA: "LOAD_PAYROLL_DATA",
  CHANGE_GENDER: "CHANGE_GENDER",
  PCP_DISPLAY_COLUMNS: "PCP_DISPLAY_COLUMNS"
}

function GlobalStoreContextProvider(props) {
  //react state that holds the store
  const [store, setStore] = useState({
    payrollData: [],
    gender: "",  //empty string is no selection
    pcp_columns: []
  });

  //reducer that sets the state of the current store
  const storeReducer = (action) => {
    const {type, payload} = action;
    switch(type) {
      case GlobalStoreActionType.LOAD_PAYROLL_DATA: {
        return setStore({
          payrollData: payload,
          gender: store.gender,
          pcp_columns: store.pcp_columns
        });
      }
      case GlobalStoreActionType.CHANGE_GENDER: {
        return setStore({
          payrollData: store.payrollData,
          gender: payload,
          pcp_columns: store.pcp_columns
        })
      }
      case GlobalStoreActionType.PCP_DISPLAY_COLUMNS: {
        return setStore({
          payrollData: store.payrollData,
          gender: store.gender,
          pcp_columns: payload
        })
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

  store.setGender = function(gender){
    storeReducer({
      type: GlobalStoreActionType.CHANGE_GENDER,
      payload: gender
    })
  }

  store.changePCP = function(columns){
    storeReducer({
      type: GlobalStoreActionType.PCP_DISPLAY_COLUMNS,
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

