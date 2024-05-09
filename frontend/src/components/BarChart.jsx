import { useState, useEffect, useContext, useRef} from 'react';
import * as d3 from 'd3';
import GlobalStoreContext from "../store/store";

export default function BarChart() {
    const { store } = useContext(GlobalStoreContext);
    let ref = useRef(null);
    let [attribute, setAttribute] = useState(null);

    useEffect(() => {
        
        
        return () => {
            d3.select(ref.current).selectAll('*').remove();
        }
    })

    const handleAttributeChange = (event) => {
        setAttribute(event.target.value)
    }

    //get the columns for the dataset
    let columns = []
    if (store.payrollData.length !== 0)
        columns = Object.keys(store.payrollData[0])

    return (
        <>
            <div ref={ref} />
            <label htmlFor='var1_dropdown'>Select Attribute</label>
                <select
                    id='var1_dropdown'
                    defaultValue={attribute}
                    onChange={handleAttributeChange}
                >
                    <option value={null} disabled>
                        -- Please select --
                    </option>
                    {columns.map((menuItem, i) => {
                        if (menuItem != "Gender")
                            return (
                                <option key={i} value={i}>
                                    {menuItem}
                                </option>
                            );
                    })}
                </select>
        </>
    )
}