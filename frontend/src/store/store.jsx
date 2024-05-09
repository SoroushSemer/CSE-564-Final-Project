import { createContext, useState } from "react";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
  LOAD_PAYROLL_DATA: "LOAD_PAYROLL_DATA",
  CHANGE_GENDER: "CHANGE_GENDER"
}

function GlobalStoreContextProvider(props) {
  //react state that holds the store
  const [store, setStore] = useState({
    payrollData: [],
    gender: "",  //empty string is no selection
  });

  //reducer that sets the state of the current store
  const storeReducer = (action) => {
    const {type, payload} = action;
    switch(type) {
      case GlobalStoreActionType.LOAD_PAYROLL_DATA: {
        return setStore({
          payrollData: payload,
          gender: store.gender
        });
      }
      case GlobalStoreActionType.CHANGE_GENDER: {
        return setStore({
          payrollData: store.payrollData,
          gender: payload
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

