import {ReactNode} from "react";
import * as React from "react";

const Repeater = ({elem, times}: { times: number, elem: (index: number) => ReactNode }) => <>
    {new Array(times).fill(0).map((_, i) => elem(i))}
</>

export default Repeater;